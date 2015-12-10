// individual data points
var bill = {
  id: '1',
  first_name: 'Bill',
  last_name: 'Stevens',
  age: 29,
  gender: 'male',
  level: 'junior'
};

var bob = {
  id: '2',
  first_name: 'Bob',
  last_name: 'Jones',
  age: 34,
  gender: 'male',
  level: 'senior'
};

var suzy = {
  id: '3',
  first_name: 'Suzy',
  last_name: 'Q',
  age: 23,
  gender: 'female',
  level: 'freshman'
};

var samer = {
  id: '1',
  first_name: 'Samer',
  last_name: 'Hammer',
  age: 42,
  gender: 'male'
};

var cade = {
  id: '2',
  first_name: 'Cade',
  last_name: 'Nichols',
  age: 29,
  gender: 'male'
};

var react101 = {
  id: '1',
  name: 'React101',
  instructor: ['1']
};

var flux105 = {
  id: '2',
  name: 'Flux105',
  instructor: ['1']
};

var jquery = {
  id: '3',
  name: 'jQuery',
  instructor: ['2']
};

var angular = {
  id: '4',
  name: 'Angular',
  instructor: ['2']
}

// groups
var courses = {
  id: 1,
  name: 'Courses at Coding House',
  courses: ['1', '2', '3', '4']
};

var instructors = {
  id: 1,
  name: 'Instructors at Coding House',
  instructors: ['1', '2']
}

var students = {
  id: 1,
  name: 'Students at Coding House',
  students: ['1', '2', '3']
}

var grades = {
  id: 1,
  name: 'Grades for students',
  grades: [
    {
      id: 1,
      student: ['1'],
      course: ['1'],
      grade: 'A'
    },
    {
      id: 2,
      student: ['2'],
      course: ['1'],
      grade: 'C'
    },
    {
      id: 3,
      student: ['3'],
      course: ['1'],
      grade: 'A'
    },
    {
      id: 4,
      student: ['1'],
      course: ['2'],
      grade: 'C'
    },
    {
      id: 5,
      student: ['2'],
      course: ['2'],
      grade: 'B'
    },
    {
      id: 6,
      student: ['3'],
      course: ['2'],
      grade: 'A'
    },
    {
      id: 7,
      student: ['1'],
      course: ['3'],
      grade: 'B'
    },
    {
      id: 8,
      student: ['3'],
      course: ['3'],
      grade: 'D'
    },
    {
      id: 9,
      student: ['3'],
      course: ['4'],
      grade: 'A'
    }
  ]
}



var data = {
  Course: {
    1: react101,
    2: flux105,
    3: jquery,
    4: angular
  },
  Instructor: {
    1: samer,
    2: cade
  },
  Student: {
    1: bill,
    2: bob,
    3: suzy
  }
}

var nextStudent = 4;

export function getCourse(id) {
  return data.Course[id];
}

export function getInstructor(id) {
  return data.Instructor[id];
}

export function getStudent(id) {
  return data.Student[id];
}

export function getAll(field) {
  switch (field) {
    case 'courses':
      return courses;
      break;
    case 'instructors':
      return instructors;
      break;
    case 'students':
      return students;
      break;
    case 'grades':
      return grades;
      break;
  }
}
