# WE:Soodaa
Web App for Book Lovers  📔
<br />

Built with [React.js + Redux + Redux-Saga + Next.js] + [Node.js + MySQL] + [Nginx + AWS]

[WeSoodaa Web App](https://wesoodaa.site)

[main_page](./prepare/front/public/wesoodaa.png)
<br />

## Functionalities
1. Post Anything about Books You Love!
- Share your book stories with other book lovers.

2. Comment on and Retweet Other Posts
- Comment and Retweet functions are there for you to diversify your wall!

3. Manage Your Followers and Followings
- Follow other users you like, and check out who are following you as well! <br />

## Tech Stack
![WeSoodaa_Tech_Stack](./public/readMeImg/wesoodaa_techstack.png)

- Front-end: React.js + Redux (State Management) + Redux-Saga (Async Actions Management) + Next.js (Server-Side Rendering)
- Back-end: Node.js + MySQL
- Deployment: AWS EC2 (front and back servers deployed), S3 (media file storage), Route53 (redirection of traffic to personal domains), and Lambda (serverless image-editing functionality) + Nginx (secure connection via https)

#### General
- Implemented RESTful Routes<br/>

#### Front-end
- **React** used to optimize rerendering and app performance.
- **React-Hooks** used to implement states and life cycle methods while using functional components for reusable and simple codes.
- **React-Router** used to manage routes and links.
- **Redux** used to centralize the states and logics of the app and to manage them easily.
- **Redux-Saga** used to manage asynchronous action flows.
- **Next.js** used to implemenet Server-Side Rendering, for better User Experience (UX) and Search Engine Optimization (SEO).
- Other Tools
  * _immer_ to ensure immutability of states.
  * _Axios_ to handle HTTP requests based on promises.
  * _Styled-component_ to style components without triggering unnecessary rerenders, to store the shared design elements, and to provide dark/light mode options.
  * _antd_ to easily style elements with pre-designed UI library.
  * _React-Slick_ to create image carousels.

#### Back-End
- **Node.js** and **Express** used to implement backend server using Java.
- Other Tools
  - *Axios* to handle HTTP requests based on promises.
  - *express-session* to introduce sessions.
  - *helmet* to strengthen security of the web, by setting several headers to prevent well-known security attacks.
  - *passport* to easily manage authentication (w/ hashed password) and authorization.
  - *sequelize* to easily implement SQL database system using JavaScript.
  - *multer* to parse multiplart form for file uploads.

#### Deployment
- Front-end server deployed on AWS EC2.
- Back-end server deployed on AWS EC2.
- AWS S3 used to store large-size media files.
- AWS Route53 used to redirect traffic to personal domains.
- AWS Lambda used to implement an image-resizing functionality serverlessly.
- *PM2* used to keep the application online 24/7 via daemonization and monitoring.  
- *Nginx* used to introduce secure connection - https. <br />
