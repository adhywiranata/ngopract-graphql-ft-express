const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const graphQLHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const fakeData = require('./fakeData');

// cors and bodyParser, as usual, for later use
app.use(cors());
app.use(bodyParser.json());

// let's build the app's schema using buildSchema()
// ugh, no syntax highlighting for backticks? Bear with it for now!
// this is the easiest way for us to build a simple GraphQL schema.

// understanding GraphQL type system: http://graphql.org/learn/schema/#type-system
const appSchema = buildSchema(`
  type School {
    name: String!
    accreditation: String!
  }

  type Student {
    id: ID!
    name: String!
    age: Int!
    score: Int!
    parentName: String
  }

  type Query {
    school: School
    students: [Student]
    failingStudents: [Student]
    passingStudents: [Student]
  }

  input NewStudentInput {
    name: String!
    age: Int!
    score: Int!
    parentName: String
  }
  
  type Mutation {
    createStudent(input: NewStudentInput): Student
  }
`);

// let's define a root data, which is an object where data resolves
const rootData = {
  school: fakeData.school,
  students: fakeData.students,
  failingStudents: fakeData.students.filter(student => student.score < 80),
  passingStudents: fakeData.students.filter(student => student.score >= 80),
  // lets create a resolver to mutate student data
  // graphql resolver will receive an input parameter from query variables
  createStudent: ({ input }) => {

    // here, we mutate our fake data
    const newId = Math.max(...fakeData.students.map(student => student.id)) + 1;
    const newStudent = {
      id: newId,
      name: input.name,
      age: input.age,
      score: 0,
    };
    fakeData.students.push(newStudent);

    // we might need to show the newly created student, so we return it
    return newStudent;
  },
};

// now we need the express app to use graphQLHTTP to serve graphql on '/graphql' route
// of course, we can change the route to '/api' or any names
app.use('/graphql', graphQLHTTP({
  schema: appSchema,
  rootValue: rootData,
  graphiql: true,
}));

app.get('/', (req, res) => {
  res.send('Welcome!!! use /graphql to visit graphiql :D');
});

app.listen(4000, () => {
  console.log('welcome to the api');
});