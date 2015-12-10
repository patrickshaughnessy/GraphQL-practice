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

import {
  getCourse,
  getInstructor,
  getStudent,
  getAll
} from './database.js';

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Course'){
      return getCourse(id);
    } else if (type === 'Instructor'){
      return getInstructor(id);
    } else if (type === 'Student'){
      return getStudent(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj.courses){
      return courseType;
    }
    // add gradeType here?
  }
);

var studentType = new GraphQLObjectType({
  name: 'Student',
  description: 'A student at Coding House',
  fields: () => ({
    id: globalIdField(),
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
      type: courseConnection,
      args: connectionArgs,
      resolve: (student, args) => {
        let myCourses = getAll('grades').grades.filter(grade => grade.student[0] === student.id)
                                   .map(grade => grade.course);
        console.log('here', myCourses);
        return connectionFromArray(myCourses.map((id) => getCourse(id)), args)
        // let theCourses = getAll('courses').courses.filter(course => myCourses.indexOf(course.name) >= 0)
        // // can return courses as is, but need to add grades of student
        //   .map(course => {
        //     let studentGrades = grades.filter(grade => grade.course === course.name)
        //     let myGrades = studentGrades.filter(grade => grade.student === obj.first_name);
        //     course.grade = myGrades[0].grade
        //     return course;
        //   })
      }
    }
  }),
  interfaces: [nodeInterface]
})

var {connectionType: studentConnection} =
  connectionDefinitions({name: 'Student', nodeType: studentType});

var instructorType = new GraphQLObjectType({
  name: 'Instructor',
  description: 'An instructor at Coding House',
  fields: () => ({
    id: globalIdField(),
    first_name: { type: new GraphQLNonNull(GraphQLString) },
    last_name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    gender: { type: new GraphQLNonNull(GraphQLString) }
  }),
  interfaces: [nodeInterface]
})

var {connectionType: instructorConnection} =
  connectionDefinitions({name: 'Instructor', nodeType: instructorType});

var courseType = new GraphQLObjectType({
  name: 'Course',
  description: 'A course at coding house',
  fields: () => ({
    id: globalIdField(),
    name: {
      type: GraphQLString,
      description: 'The name of the course',
    },
    instructor: {
      type: instructorConnection,
      description: 'The instructor teaching the course',
      args: connectionArgs,
      resolve: (course, args) => connectionFromArray(course.instructor.map((id) => getInstructor(id)), args)
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: courseConnection} =
  connectionDefinitions({name: 'Course', nodeType: courseType});

var gradeType = new GraphQLObjectType({
  name: 'Grade',
  description: 'The grade for a student at Coding House',
  fields: () => ({
    id: globalIdField(),
    student: {
      type: studentConnection,
      args: connectionArgs,
      resolve: (grade, args) => connectionFromArray(grade.student.map((id) => getStudent(id)), args)
    },
    course: {
      type: courseConnection,
      args: connectionArgs,
      resolve: (grade, args) => connectionFromArray(grade.course.map((id) => getCourse(id)), args)
    }
  }),
  interfaces: [nodeInterface]
})

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    courses: {
      type: new GraphQLList(courseType),
      resolve: () => getAll('courses').courses.map((id) => getCourse(id))
    },
    instructors: {
      type: new GraphQLList(instructorType),
      resolve: () => getAll('instructors').instructors.map((id) => getInstructor(id))
    },
    students: {
      type: new GraphQLList(studentType),
      resolve: () => getAll('students').students.map((id) => getStudent(id))
    },
    grades: {
      type: new GraphQLList(gradeType),
      resolve: () => getAll('grades').grades
    }
  }),
  node: nodeField
})


// let schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'Query',
//     fields: () => ({
//       answer: {
//         type: GraphQLInt,
//         resolve: () => 42
//       }
//     })
//   })
// })

var schema = new GraphQLSchema({
  query: queryType
});
export default schema
