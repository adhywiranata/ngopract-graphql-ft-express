const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const graphQLHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const fakeData = require('./fakeData');

// cors and bodyParser, as usual
app.use(cors());
app.use(bodyParser.json());

const appSchema = buildSchema(`
  type School {
    id: ID!,
    name: String!,
    accreditation: String!,
  }

  type Student {
    id: ID!,
    name: String!,
    age: Int!,
    parentName: String,
  }

  type Query {
    school: School,
    students: [Student],
    failingStudents: [Student],
    passingStudents: [Student],
  }
`);

const rootData = {
  school: fakeData.school,
  students: fakeData.students,
  failingStudents: fakeData.students.filter(student => student.score < 80),
  passingStudents: fakeData.students.filter(student => student.score >= 80),
};

app.use('/graphql', graphQLHTTP({
  schema: appSchema,
  rootValue: rootData,
  graphiql: true,
}));

app.get('/', (req, res) => {
  res.send('Welcome!!!');
});

app.listen(4000, () => {
  console.log('welcome to the api');
});