import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean
} from 'graphql';

import {
  connectionArgs,
  forwardConnectionArgs,
  backwardConnectionArgs,
  connectionDefinitions,
  connectionFromArray,
  connectionFromPromisedArray,
  cursorForObjectInConnection,
  nodeDefinitions,
  toGlobalId,
  fromGlobalId,
  globalIdField,
  pluralIdentifyingRootField,
  mutationWithClientMutationId,
} from 'graphql-relay';

let students = [
  {
    first_name: 'Bill',
    last_name: 'Stevens',
    age: 29,
    gender: 'male',
    level: 'junior'
  },
  {
    first_name: 'Bob',
    last_name: 'Jones',
    age: 34,
    gender: 'male',
    level: 'senior'
  },
  {
    first_name: 'Suzy',
    last_name: 'Q',
    age: 23,
    gender: 'female',
    level: 'freshman'
  }
]

let instructors = [
  {
    first_name: 'Samer',
    last_name: 'Hammer',
    age: 42,
    gender: 'male'
  },
  {
    first_name: 'Cade',
    last_name: 'Nichols',
    age: 29,
    gender: 'male'
  }
]

let courses = [
  {
    name: 'React101',
    instructor: 'Samer'
  },
  {
    name: 'Flux105',
    instructor: 'Samer'
  },
  {
    name: 'jQuery',
    instructor: 'Cade'
  },
  {
    name: 'Angular',
    instructor: 'Cade'
  }
]

let grades = [
  {
    student: 'Bill',
    course: 'React101',
    grade: 'A'
  },
  {
    student: 'Bob',
    course: 'React101',
    grade: 'C'
  },
  {
    student: 'Suzy',
    course: 'React101',
    grade: 'A'
  },
  {
    student: 'Bill',
    course: 'Flux105',
    grade: 'C'
  },
  {
    student: 'Bob',
    course: 'Flux105',
    grade: 'B'
  },
  {
    student: 'Suzy',
    course: 'Flux105',
    grade: 'A'
  },
  {
    student: 'Bill',
    course: 'jQuery',
    grade: 'B'
  },
  // {
  //   student: 'Bob',
  //   course: 'jQuery',
  //   grade: 'A'
  // },
  {
    student: 'Suzy',
    course: 'jQuery',
    grade: 'D'
  },
  // {
  //   student: 'Bill',
  //   course: 'Angular',
  //   grade: 'C'
  // },
  // {
  //   student: 'Bob',
  //   course: 'Angular',
  //   grade: 'A'
  // },
  {
    student: 'Suzy',
    course: 'Angular',
    grade: 'A'
  }
]

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    return data[type][id];
  },
  (obj) => {
    return obj.students ? gradeType : studentType;
  }
)


let gradeType = new GraphQLObjectType({
  name: "Grade",
  fields: () => ({
    id: globalIdField(),
    student: {
      type: StudentConnection,
      args: connectionArgs,
      resolve: (grade, args) => {
        console.log(grade, args);
        return connectionFromArray(students.filter(student => student.first_name === obj.student)[0])
      }
    }
    // course: {
    //   type: courseType,
    //   resolve: (obj) => {
    //     return courses.filter(course => course.name === obj.course)[0];
    //   }
    // },
    // grade: { type: new GraphQLNonNull(GraphQLString) }
  }),
  interfaces: [nodeInterface]
})

// relay connection definition
var {connectionType: StudentConnection} =
  connectionDefinitions({nodeType: studentType});

let courseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    instructor: {
      type: instructorType,
      resolve: (obj) => {
        return instructors.filter(instructor => instructor.first_name === obj.instructor)[0];
      }
    },
    grade: { type: GraphQLString }
  })
});

let instructorType = new GraphQLObjectType({
  name: "Instructor",
  fields: () => ({
    first_name: { type: new GraphQLNonNull(GraphQLString) },
    last_name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    gender: { type: new GraphQLNonNull(GraphQLString) }
  })
});

let studentType = new GraphQLObjectType({
  name: "Student",
  fields: () => ({
    first_name: { type: new GraphQLNonNull(GraphQLString) },
    last_name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    gender: { type: new GraphQLNonNull(GraphQLString) },
    level: { type: new GraphQLNonNull(GraphQLString) },
    fullName: {
      type: GraphQLString,
      resolve: (obj) => `${obj.first_name} ${obj.last_name}`
    },
    courses: {
      type: new GraphQLList(courseType),
      resolve: (obj) => {
        let myCourses = grades.filter(grade => grade.student === obj.first_name)
                                   .map(grade => grade.course);
        return courses.filter(course => myCourses.indexOf(course.name) >= 0)
        // can return courses as is, but need to add grades of student
          .map(course => {
            let studentGrades = grades.filter(grade => grade.course === course.name)
            let myGrades = studentGrades.filter(grade => grade.student === obj.first_name);
            course.grade = myGrades[0].grade
            return course;
          })
      }
    }
  })
});

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      students: {
        type: new GraphQLList(studentType),
        resolve: () => students
      },
      instructors: {
        type: new GraphQLList(instructorType),
        resolve: () => instructors
      },
      courses: {
        type: new GraphQLList(courseType),
        resolve: () => courses
      },
      grades: {
        type: new GraphQLList(gradeType),
        resolve: () => grades
      },
      node: nodeField
    })
  })
})

export default schema
