# [FosterFlow.com](https://fosterflow.com)

![ezgif com-video-to-gif](https://github.com/soshace/fosterflow/assets/761219/e367b5dc-87b0-4c15-aaed-e1c125eb2089)

Our project is a startup that leverages the power of the GPT4 and LLM/ML models. The main objective is to create a
unified application that combines the comprehensive functionality offered ML models with our UI mechanics.
By harnessing the capabilities of the GPT like models, we aim to provide users with a seamless and intelligent
conversational experience within a single application.

## Overview

For the frontend, we have selected React.js, while for the backend, we have decided to use Django Rest Framework. The
communication between the frontend and backend is facilitated through APIs. We have made significant progress in the
implementation phase, completing the following tasks:

1. **Application UI Design**: We have designed and developed the user interface of the application, ensuring an
   intuitive and visually appealing experience for our users.
2. **User Authentication with JWT**: The application features secure user authentication using JSON Web Tokens (JWT),
   providing a seamless and reliable authentication mechanism.
3. **Email Confirmation Functionality**: We have implemented email confirmation functionality, ensuring that user
   accounts are verified through a confirmation link sent to their registered email addresses.
4. **Integration with the Language Model**: We have successfully integrated the Chat-GPT language model into the
   application, enabling advanced natural language processing capabilities and intelligent conversations.
5. **Swagger Documentation**: To ensure clarity and facilitate API usage, we have provided documentation using Swagger,
   outlining the available endpoints, request/response structures, and parameters.

## Todo

There are the upcoming tasks and features on our todo list that we plan to implement:

* **Single sign-on**: Enable users to authenticate and log in to the application using their social media accounts such
  as Facebook, Twitter, or Google. This will provide a convenient and streamlined login experience for our users.
* **Access to different types of LLM/ML models**: Allow users to smoothly switch to the best model for solving an exact
  task using model name @model_name like we do with real users into chats.

## Instalation SSL certification for https connection

1. Make a copy of nginx.conf.template -> nginx.conf;
2. Uncomment into frontend/nginx.conf lines for SSL certificate;
3. Insatall cerbot:
```
apt install certbot python3-certbot-nginx
certbot --nginx -d chat.fosterflow.com
```

## Installation

The project is launched via Docker-Compose. Docker works with [volumes](https://docs.docker.com/storage/volumes/), so
any changes will be automatically applied. To install Docker Desktop, follow the instructions on the official website,
depending on your platform, [link](https://docs.docker.com/desktop/).

The following are the steps to launch:

1. Download the project;
2. Go to the project directory
3. Rename .env.template to .env (make changes if you need it);
4. Run Docker Desktop application;
5. In the command line, write:
```
docker-compose build
docker-compose up
```

After following this instruction, the interaction is available at ```localhost/chat```



## Contributing

We welcome and encourage contributions from the community to enhance our project. Whether you're a developer, designer,
tester, or a user with valuable feedback, your contributions are highly appreciated. Here's how you can contribute to
our project:

* Reporting Issues: If you come across any bugs, errors, or have suggestions for improvements, please open an issue on
  our GitHub repository. Provide a detailed description of the problem or suggestion, along with any relevant
  information that can help us understand and reproduce the issue.
* Submitting Pull Requests: If you'd like to contribute code or features, you can submit a pull request on our GitHub
  repository. Our team will review your pull request and provide feedback or merge it if it aligns with the project's
  goals.
* Feedback and Ideas: We value your feedback and ideas for improving the project. If you have suggestions, feature
  request, or any other input, please don't hesitate to reach out to us via email at hello@fosterflow.com

## We are in social media

* [Twitter](https://twitter.com/fosterflow_com)
* [Linkedin](https://www.linkedin.com/company/fosterflow/)
* [Facebook](https://www.facebook.com/fosterflowcom)
