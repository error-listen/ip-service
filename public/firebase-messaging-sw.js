importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAlDtvO48-uf1gvQQZuxR73Ok2W21EjfTg",
    authDomain: "ip-service-b26fa.firebaseapp.com",
    projectId: "ip-service-b26fa",
    storageBucket: "ip-service-b26fa.appspot.com",
    messagingSenderId: "18150881262",
    appId: "1:18150881262:web:48e709dd5a51023d9440ff",
    measurementId: "G-L643WZGJGB"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    console.log(payload)
    const notificationTitle = 'Etapa finalizada';
    const notificationOptions = {
        body: `${payload.data.technician.toUpperCase()} finalizou etapa ${payload.data.step_name.toUpperCase()} do serviço ${payload.data.service_name.toUpperCase()} do cliente ${payload.data.client_name.toUpperCase()}`
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});

