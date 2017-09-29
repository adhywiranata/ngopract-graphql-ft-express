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
  GraphQLInputObjectType,
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
    parentName: {
      type: GraphQLString,
    },
    score: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});

// now let's create an appQuery to contain all fields, school and students
// each field resolves to a value from the fakeData
const QueryType = new GraphQLObjectType({
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

// to add a new student, we need to add a newStudent input type
const StudentInputType = new GraphQLInputObjectType({
  name: 'StudentInputType',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    age: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    parentName: {
      type: GraphQLString,
    },
    score: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }
});

// then, we need the mutation
const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createStudent: {
      type: StudentType,
      args: {
        input: {
          name: 'input',
          type: StudentInputType,
        }
      },
      resolve: (obj, args) => {
        const { input } = args;
        const newId = Math.max(...fakeData.students.map(student => student.id)) + 1;
        const newStudent = {
          id: newId,
          name: input.name,
          age: input.age,
          parentName: input.parentName,
          score: input.score,
        };
        fakeData.students.push(newStudent);
        return newStudent;
      }
    }
  }
})

const appSchema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
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