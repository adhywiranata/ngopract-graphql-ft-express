const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const graphQLHTTP = require('express-graphql');
const {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} = require('graphql');

const fakeData = require('./fakeData');

// cors and bodyParser, as usual, for later use
app.use(cors());
app.use(bodyParser.json());

// let's define the type for School using GraphQLObjectType
// GraphQLObjectType usually consists of name and fields.
const SchoolType = new GraphQLObjectType({
  name: 'School',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    accreditation: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

// type for single Student
const StudentType = new GraphQLObjectType({
  name: 'Student',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    age: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    score: {
      type: GraphQLInt,
    },
  },
});

// now let's create an appQuery to contain all fields, school and students
// each field resolves to a value from the fakeData
const appQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    school: {
      type: SchoolType,
      resolve: () => fakeData.school,
    },
    students: {
      type: new GraphQLList(StudentType),
      resolve: () => fakeData.students,
    },
  },
});

const appSchema = new GraphQLSchema({
  query: appQuery,
});

app.use('/graphql', graphQLHTTP({
  schema: appSchema,
  graphiql: true,
}));

app.get('/', (req, res) => {
  res.send('Welcome!!! use /graphql to visit graphiql :D');
});

app.listen(4000, () => {
  console.log('welcome to the api');
});