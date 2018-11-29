// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  config: {
    apiKey: "AIzaSyAnMTfVR9tjrbtFVH6zazDIBAl1m1VTgnc",
    authDomain: "siadri-dev.firebaseapp.com",
    databaseURL: "https://siadri-dev.firebaseio.com",
    projectId: "siadri-dev",
    storageBucket: "siadri-dev.appspot.com",
    messagingSenderId: "145695131403"
  },
  cloudUrl:'https://us-central1-siadri-dev.cloudfunctions.net',
  mails:{
    dirDRI:"sistema.siadri@correounivalle.edu.co"
  }
};

