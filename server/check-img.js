fetch('http://localhost:5000/uploads/coverImage-1782212010598-461429811.jpg').then(res => {
  console.log("Status:", res.status);
  console.log("Headers:", res.headers);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
