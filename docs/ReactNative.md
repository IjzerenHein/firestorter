### react-native support

React-native is fully supported by Firestorter. The best way to use Firebase and Firestorter
on react-native is to use the awesome [react-native-firebase](https://github.com/invertase/react-native-firebase) package. This library wraps the native
iOS/Android Firebase SDK in a compatible JavaScript layer so it can be used in react-native.
The biggest benefits of this are that offline Firestore persistency becomes available to the
app, and other Firebase services such as deep-linking.

The best starting point for using Firestore on react-native is to use the [react-native-firebase-starter](https://github.com/invertase/react-native-firebase-starter)
application. Please follow all the instructions on how to setup firebase correctly. Once done,
you can import firebase from `react-native-firebase` and use it with firestorter:

```js
import firebase from "react-native-firebase";
import { initFirestorter } from "firestorter";

// Initialize firestorter
initFirestorter({ firebase });
```

🤘
