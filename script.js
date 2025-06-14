console.log("Dashboard-Skript geladen. Versuche, Verbindung aufzubauen...");

// ==============================================================================
// WICHTIG: Ersetzen Sie die Platzhalter in diesem Block mit Ihren echten Daten!
// ==============================================================================
const options = {
  host: 'af8cf52f9c6c4086bc2bb48853986974.s1.eu.hivemq.cloud',
  port: 8884,                                 
  protocol: 'wss',                            
  username: "dashboard-consumer",      
  password: "DashboardTest5678"    
};
// ==============================================================================

// Verbindet sich mit dem MQTT Broker
const client = mqtt.connect(options);

// Diese Funktion wird ausgeführt, wenn die Verbindung erfolgreich war
client.on('connect', function () {
  console.log('Erfolgreich mit HiveMQ Cloud verbunden!');
  
  const topicToSubscribe = 'MyCompany/Biberach/Produktion_A/Fraesmaschine_01/#';
  
  client.subscribe(topicToSubscribe, function (err) {
    if (!err) {
      console.log(`Topic '${topicToSubscribe}' erfolgreich abonniert! Warte auf Nachrichten...`);
    } else {
      console.error('Fehler beim Abonnieren:', err);
    }
  });
});

// Diese Funktion wird jedes Mal ausgeführt, wenn eine neue Nachricht ankommt
client.on('message', function (topic, message) {
  try {
    const data = JSON.parse(message.toString());
    console.log(`Nachricht empfangen auf Topic [${topic}]:`, data);

    const sensor = topic.split('/').pop();

    // Jetzt aktualisieren wir das richtige HTML-Element
    switch(sensor) {
      case 'Temperatur':
        document.getElementById('temp-value').innerText = data.value + " °C";
        break;
      case 'Druck':
        document.getElementById('pressure-value').innerText = data.value + " bar";
        break;
      case 'Vibration':
        document.getElementById('vibration-value').innerText = data.value + " mm/s";
        break;
      case 'Status':
        document.getElementById('status-value').innerText = data.value;
        break;
      case 'Teilezaehler':
        document.getElementById('counter-value').innerText = data.value + " Stk";
        break;
    }
  } catch (e) {
    console.error("Fehler beim Verarbeiten der Nachricht:", e);
  }
});

// Falls ein Fehler bei der Verbindung auftritt
client.on('error', function (err) {
  console.error('Verbindungsfehler:', err);
  alert("Verbindung zum Daten-Server fehlgeschlagen. Bitte prüfen Sie die Entwickler-Konsole (F12) auf Fehler.");
  client.end();
});
