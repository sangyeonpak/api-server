fetch("/api/kitchen")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  });