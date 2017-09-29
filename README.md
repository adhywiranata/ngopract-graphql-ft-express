# Ngopract GraphQL feat ExpressJS
> :sparkles: Super simple guide on building GraphQL server using ExpressJS

## Getting Started
``yarn add graphql express graphql-express``

## Start Server and Serve Client
``yarn start``

## Start Server and Serve Client (Development)
``yarn dev``

## Ngopract Releases
Ngopract release iteration consists of several branches (01-, 02-, etc) to ensure the best "ngopract" experience.

- [01-Simple GraphQL Query](https://github.com/adhywiranata/ngopract-graphl-ft-express/tree/01-simple-graphql-query), simple getting started with query using an in-memory global variable fake database

sample query
```
query {
  students {
    name
    parentName
  }
}
```

- [02-Simple GraphQL Query and Mutation](https://github.com/adhywiranata/ngopract-graphl-ft-express/tree/02-simple-graphql-mutation), simple getting started with query and mutation

sample mutation query
```
mutation CreateStudent($newStudent: NewStudentInput!) {
  createStudent(data: $newStudent) {
    name
    age
    score
  }
}
```

query variables for mutation

```
{
  "newStudent": {
    "name": "wawan",
    "age": 18,
    "score": 20,
    "parentName": "dodo"
  }
}
```

- [03- GraphQL Query](https://github.com/adhywiranata/ngopract-graphl-ft-express/tree/03-graphql-query), the end result is the same as step 01, but built without using `buildSchema` method and use GraphQLObject instead.