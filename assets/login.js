window.addEventListener("DOMContentLoaded", () => {
  var firebaseConfig = {
    apiKey: "AIzaSyB-uoNoKViBsZT1gvXYOZajV2tP7CSWyjg",
    authDomain: "nettside-a7c42.firebaseapp.com",
    databaseURL: "https://nettside-a7c42.firebaseio.com",
    projectId: "nettside-a7c42",
    storageBucket: "nettside-a7c42.appspot.com",
    messagingSenderId: "429448915728",
    appId: "1:429448915728:web:d89ed55f7eca4c3f481395",
    measurementId: "G-HZJ8JZQGG5"
};
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
          document
          .getElementById("login")
          .addEventListener("submit", (event) => {
              event.preventDefault();
            const login = event.target.login.value;
            const password = event.target.password.value;
            firebase
              .auth()
              .signInWithEmailAndPassword(login, password)
              .then(({ user }) => {
                return user.getIdToken().then((idToken) => {
                  return fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({ idToken }),
                  });
                });
              })
              .then(() => {
                return firebase.auth().signOut();
              })
              .then(() => {
                window.location.assign("/kontroll.ejs");
              })
              .catch((error) =>{
                var error_message = error.message;
                alert(error_message);
              });
            return false;
          });
        })