const flightsData = Array.from({ length: 30 }, (_, i) => {
  const airlines = ['Air Asia', 'Delta', 'United', 'American Airlines', 'JetBlue', 'Southwest'];
  const airports = ['Paris', 'London', 'JFK', 'LAX', 'ORD', 'ATL', 'DFW', 'SFO', 'SEA', 'DEN', 'MIA', 'BOS'];
  const statuses = ['Upcoming', 'Boarding Soon', 'Delayed', 'Cancelled'];
  const durations = ['1h 45m', '2h 15m', '3h 10m', '4h 20m'];
  const stops = ['Non-stop', '1 Stop', '2 Stops'];

  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const pad = (n) => n.toString().padStart(2, '0');

  const departureHour = Math.floor(Math.random() * 12) + 1;
  const arrivalHour = departureHour + Math.floor(Math.random() * 3) + 1;

  const departureTime = `${pad(departureHour)}:${pad(Math.floor(Math.random() * 60))}`;
  const arrivalTime = `${pad(arrivalHour % 24)}:${pad(Math.floor(Math.random() * 60))}`;

  const price = Math.floor(Math.random() * 50000) + 3000;
  const date = new Date();
  date.setDate(date.getDate() + i);
  const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  return {
    airline: 'Air Asia', // consistent for now, or use random(airlines) if needed
    flightNumber: `6E-${1000 + i}`,
    departure: random(airports),
    arrival: random(airports),
    departureTime,
    arrivalTime,
    duration: random(durations),
    stops: random(stops),
    price,
    status: random(statuses),
    date: formattedDate,
  };
});

export default flightsData;
