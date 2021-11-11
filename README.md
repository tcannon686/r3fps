# r3fps

r3fps is a simple scene editor and soon-to-be game created using
[react-three-fiber](https://github.com/pmndrs/react-three-fiber), [Material
UI](https://material-ui.com/), and
[tcollide](https://github.com/tcannon686/tcollide) (my own library for collision
detection).  At the moment, you can place simple shapes known as "brushes", and
modify their properties in the inspector, or by dragging them around with some
arrows. You can enable physics for different brushes by unchecking _Kinematic_
in the _Inspector_. You can also place a few different kinds of lights, and
position them in the scene, and change their color.

r3fps can load and save scenes, and is available in the browser! Try it out
[here](https://tcannon686.github.io/r3fps). Some example scenes are available
from the examples/scenes directory.

## Usage
Set up using the guide below, then open up the project in a browser. You should
be able to place objects by clicking them in the _Palette_ tab. Next, you can
click on objects to select them. Modify their properties by clicking the
_Inspector_ tab, or by moving them around with the arrows in the 3D view. Right
click and drag in the 3D view to rotate the camera. While moving the camera, you
can use WASD to move around, and E to move up and Q to move down. Press the
Delete key to delete selected objects. You can also undo and redo by pressing
Control-Z and Control-Shift-Z. You can play the scene by clicking the play
button. Just be sure you add a player spawnpoint!

---
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
