/* eslint-disable */
const form = document.querySelector('form');
const logoutLink = document.querySelectorAll('.logoutLink');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log(username, password);
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://localhost:3000/api/users/login',
        data: {
          username,
          password,
        },
      });
      if (res.status === 200) {
        window.setTimeout(() => {
          location.assign('/');
        }, 250);
      }
    } catch (err) {
      console.log(err.response.data.message);
    }
  });
}

logoutLink.forEach((link) => {
  link.addEventListener('click', async (e) => {
    try {
      const res = await axios({
        method: 'GET',
        url: 'http://localhost:3000/api/users/logout',
      });
      if (res.status === 200) location.assign('/');
    } catch (err) {
      //Create an alert for this instead of console.log
      console.log(err, 'Error logging out. Please try again!');
    }
  });
});

//TODO add alerts instead of console.log errors
//TODO add error page
