## Run the code
You can find our repo here: https://github.com/zoe3351/web

Run these commands to serve this website on your own machine:

```
$ git clone https://github.com/zoe3351/web.git

$ bower install

$ http-server .
```


Then you should be able to sever the website on port 8080(default), and be able to visit website on http://127.0.0.1:8080

  

## Introduction
This application is mainly built with AngularJS@1.5.0. Use bower as package manager, and Docker for easy deployment. It communicates with backend server through http protco.

## Basic Concepts

### AngularJS

#### Module 

You can think of a module as a container for the different parts of your app – controllers, services, filters, directives, etc. 

#### Controller 

In AngularJS, a Controller is defined by a JavaScript  **constructor function**  that is used to augment the  [AngularJS Scope](https://docs.angularjs.org/guide/scope).
Controllers can be attached to the DOM in different ways. For each of them, AngularJS will instantiate a new Controller object.

#### Services

AngularJS services are substitutable objects that are wired together using [dependency injection (DI)](https://docs.angularjs.org/guide/di). You can use services to organize and share code across your app.

#### Data Binding

Data-binding in AngularJS apps is the automatic synchronization of data between the model and view components. The way that AngularJS implements data-binding lets you treat the model as the single-source-of-truth in your application. The view is a projection of the model at all times. When the model changes, the view reflects the change, and vice versa.

#### Form Validation

Form and controls provide validation services, so that the user can be notified of invalid input before submitting a form. This provides a better user experience than server-side validation alone because the user gets instant feedback on how to correct the error. Keep in mind that while client-side validation plays an important role in providing good user experience, it can easily be circumvented and thus can not be trusted. Server-side validation is still necessary for a secure application.


## Code Structure
#### Index.html Page
The index.html is the main page of the whole web application. It contains the header, the navigation bar and the footer. And it refers to the other pages in the ng-view div tag. AngularJS does routing, helps to navigate through subpages.

#### App.js file
This javaScript file contains the main angular module “catapp”. And this module has a few controllers and services. Each controller handles the functionality and logic of each page, and directives are mainly for supporting services such as data fetching.

Besides, this file also define how angular support routing though $routeProvider in app.config function.


#### Pages
This folder contains all subpages html files.

  

#### JS
This folder contains all other javascript files.

  
## Main components:

#### Home page
#### Map page
Map page has proposal list and the ArcGIS map.

Controller: mapController

Js files: layout, arcgis

Functionality: render proposal list, submit draft proposal, vote proposal, grade proposal

#### Register page
Controller: registerController

Functionality: register user

#### Login page
Controller: loginController

Functionality: login user

#### Profile page
Controller: profileController

Functionality: view & edit user profile

#### User Management page
Controller: usermgtController

Functionality: edit user information

#### Draft Proposal Management page
Controller: draftmgtController

Functionality: edit&export draft proposal information


#### Final Proposal Management page
Controller: finalmgtController

Functionality: edit & import final proposal information


#### Phase Management page
Controller: phasemgtController

Functionality: change phase & change proposal showing on each phase


#### Final Proposal Detail Page
Controller: proposalDetailController

Functionality: edit final proposal detail

  

#### Ballot page
Controller: ballotController

Functionality: handle paper ballot