# teamwork <img src="https://travis-ci.com/Simeon979/teamwork.svg?branch=develop" /> [![Coverage Status](https://coveralls.io/repos/github/Simeon979/teamwork/badge.svg?branch=develop)](https://coveralls.io/github/Simeon979/teamwork?branch=develop)

## Project Overview

Teamwork is an ​ internal social network for employees of an organization. The goal of this application is to facilitate more interaction between colleagues and promote team bonding.

## Getting Started

- Start a PostgreSQL server and create a database table named `teamwork`
- Run the `sql` scripts (`***.sql`) in the `db` folder
  ```bash
    psql -f db/000001.sql -d teamwork
    psql -f db/000002.sql -d teamwork
    psql -f db/000003.sql -d teamwork
    psql -f db/000004.sql -d teamwork
    psql -f db/000005.sql -d teamwork
  ```
- Export the connection string to the environment as `DATABASE_URL`
- Get a cloudinary api key and export as
- Run `npm start` to start the application on port `3100` or the port specified in the environment variable `PORT`

> A live version of the API can be found at 'https://nameless-spire-94806.herokuapp.com/api/v1'

#### API Endpoint Specification

- POST /auth/create-user

  Create user account

  > Note ​: Only admin can create an employee user account.

  > An administrator account can be created either in the database or by creating a user with jobRole `admin`

  Request spec

  body

  ```json
  {
    “firstName”​: ​String​,
    ​“lastName”​: ​String​,
    “email”​: ​​String​,
    “password”​: ​​String​,
    “gender”​: ​​String​,
    ​“jobRole”​: ​String​,
    ​“department”​: ​String​,
    ​“address”​: ​String​,
  }
  ```

  header

  ```json
  {
    "token": String
  }
  ```

  Response spec:

  ```json
  {
    “status” ​:​ ​“success”​,
    ​“data” ​:​ ​{
    ​“message”​:​ “User account successfully created”​,
    ​“token” ​:​ ​ ​String​,
    ​“userId”​:​ Integer​,
    }
  }
  ```

- POST /auth/signin

  Login a user

  > Admin/Employees can sign in

  Request spec

  body

  ```
  {
    “email”​:​ ​String​,
    “password”​:​ ​String​,
  }
  ```

  ###### Response spec:

  ```json
  {
  “status” ​:​ ​“success”​,
  ​“data” ​:​ ​{
  ​“token” ​:​ ​ ​String​,
  “userId”​:​ Integer​,
  ​}
  }
  ```

* POST /gifs

  Create a gif.

  Request spec: (Header)

  ```
  {
    “token”​:​ ​String​,
  }
  ```

  Request spec: (Body)

  ```
  {
    “image”​:​ ​image/gif​,
    ​“title”​:​ ​String​,
  }
  ```

  Response spec:

  ```
  {
    “status” ​:​ ​“success”​,
    ​“data” ​:​ ​{
    “gifId” ​:​ ​ ​Integer​,
    ​“message” ​:​ ​ ​“GIF image successfully posted”​,
    “createdOn” ​:​ ​ ​DateTime​,
    ​“title” ​:​ ​ ​String​,
    “imageUrl” ​:​ ​ ​String​,
    ​}
  }
  ```

* POST /articles

  Create an article

  Request spec: (Header)

  ```
  {
    “token”​:​ ​String​,
  }
  ```

  Request spec: (Body)

  ```
  {
    ​“title”​:​ ​String​,
    ​“article”​:​ ​String​,
  }
  ```

  Response spec:

  ```
  {
    “status” ​:​ ​“success”​,
    ​“data” ​:​ ​{
    ​“message” ​:​ ​ ​“Article successfully posted”​,
    “articleId” ​:​ ​ ​Integer​,
    “createdOn” ​:​ ​ ​DateTime​,
    ​“title” ​:​ ​ ​String​,
    ​}
  }
  ```

* PATCH /articles/<:articleId>

  Edit an article

  Request spec: (Header)

  ```
  {
  “token”​:​ ​String​,
  }
  ```

  Request spec: (Body)

  ```
  {
  ​“title”​:​ ​String​,
  ​“article”​:​ ​String​,
  }
  ```

  Response spec:

  ```
  {
    “status” ​:​ ​“success”​,
    ​“data” ​:​ ​{
    ​“message” ​:​ ​ ​“Article successfully updated”​,
    ​“title” ​:​ ​ ​String​,
    ​“article” ​:​ ​ ​String​,
    ​}
  }
  ```

* DELETE /articles/<:articleId>

  Employees can delete their articles

  Request spec: (Header)

  ```
  {
    “token”​:​ ​String​,
  }
  ```

  Response spec:

  ```
  {
    “status” ​:​ ​“success”​,
    ​“data” ​:​ ​ {
    ​“message”​: ​“Article successfully deleted”​,
    ​}
  }
  ```

* DELETE /gifs/<:gifId>

  Employees can delete their gifs

  Request spec: (Header)

  ```
  {
    “token”​:​ ​String​,
  }
  ```

  Response spec:

  ```
  {
    “status” ​:​ ​“success”​,
    ​“data” ​:​ ​ {
    ​“message”​: ​“gif post successfully deleted”​,
    ​}
  }
  ```

* POST /articles/<articleId>/comment

  Employees can comment on other colleagues' article post.

  Request spec: (Header)

  ```
  {
    “token”​:​ ​String​,
  }
  ```

  Request spec: (body)

  ```
  {
    “comment”​:​ ​String​,
  }
  ```

  Response spec:

  ```
  {
  “status” ​:​ ​“success”​,
    ​“data” ​:​ ​ {
    “message”​: ​“Comment successfully created”​,
    ​“createdOn”​: ​DateTime​,
    “articleTitle”​: ​String​,
    ​“article”​: ​String​,
    “comment”​: ​String​,
    ​}
  }
  ```

* POST /gifs/<:gifId>/comment

  Employees can comment on other colleagues' gif post.

  Request spec: (Header)

  ```
  {
    “token”​:​ ​String​,
  }
  ```

  Request spec: (body)

  ```
  {
    “comment”​:​ ​String​,
  }
  ```

  Response spec:

  ```
  {
    “status” ​:​ ​“success”​,
    ​“data” ​:​ ​ {
    “message”​: ​“comment successfully created”​,
    ​“createdOn”​: ​DateTime​,
    “gifTitle”​: ​String​,
    “comment”​: ​String​,
    ​}
  }
  ```

* GET /feed

  Employees can view all articles or gifs, showing the most recently posted articles

  or gifs first.

  Request spec: (Header)

  ```
  {
    “token”​:​ ​String​,
  }
  ```

  Response spec:

  ```
  {
    “status”​: ​​“success”​,
    ​“data”​: ​​[{
        ​“id”​: ​Integer​,
        “createdOn”​: ​DateTime​,
        “title”​: ​String​,
        ​“article / url”​: ​String​, //url for gif post and article for articles
        ​“authorId”​: ​​​Integer​,
        ​
      },
      {
        ​“id”​: ​Integer​,
        “createdOn”​: ​DateTime​,
        “title”​: ​String​,
        ​“article / url”​: ​String​, //url for gif post and article for articles
        ​“authorId”​: ​​​Integer​,
        ​
      },
      {
        ​“id”​: ​Integer​,
        “createdOn”​: ​DateTime​,
        “title”​: ​String​,
        ​“article / url”​: ​String​, //url for gif post and article for articles
        ​“authorId”​: ​​​Integer​,
      },

    ]
  }
  ```

* GET /articles/<:articleId>

  Employees can view a specific article.

  Request spec: (Header)

  ```
  {
  “token”​:​ ​String​,
  }
  ```

  Response spec:

  ```
  {
    “status”​: ​​“success”​,
    ​“data”​: ​​{
      ​“id”​: ​Integer​,
      “createdOn”​: ​DateTime​,
      “title”​: ​String​,
      ​“article”​: ​String​,
      ​“comments”​: ​[
        {
          ​“commentId”​: ​Integer​,
          ​“comment”​: ​String​,
          ​“authorId”​: ​​​Integer​,
        }​,
        {
          ​“commentId”​: ​Integer​,
          ​“comment”​: ​String​,
          ​“authorId”​: ​​​Integer​,
        }​,
      ]​
    }
  }
  ```

* GET /gifs/<:gifId>

  Employees can view a specific gif post.

  Request spec: (Header)

  ```
  {
    “token”​:​ ​String​,
  }
  ```

  Response spec:

  ```
  {
    “status”​: ​​“success”​,
    ​“data”​: ​​{
      ​“id”​: ​Integer​,
      “createdOn”​: ​DateTime​,
      “title”​: ​String​,
      ​“url”​: ​String​,
      ​“comments”​: ​[
        {
          ​“commentId”​: ​Integer​,
          “authorId”​: ​Integer​,
          ​“comment”​: ​String​,
        },
        {
          ​“commentId”​: ​Integer​,
          ​“useauthorIdrId”​: ​Integer​,
          ​“comment”​: ​String​,
        }
      ]​
    }
  }
  ```
