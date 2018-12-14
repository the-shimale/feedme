'use strict';

let NUM_CATEGORIES = 20;

const onLoad = () => {
	// $("#rating").slider({ min: 1, max: 5, value: [1, 5], focus: true });
	// let ratingSlider = new Slider("#rating", { min: 1, max: 5, value: [1, 5], focus: true });
	// $.ajax({
 //    url: `https://api.yelp.com/v3/categories/en_US`,
 //    method: "get",
 //    success: data => {
 //      // create buttons for NUM_CATEGORIES
 //      let $categories = $("#categories");
 //      for (let i = 0; i < NUM_CATEGORIES; ++i) {
 //      	$categories.append(`<button type="button" class="btn btn-secondary">${data.categories[i].title}</button>`)
 //      }
 //    },
 //    error: err => {
 //      let errorEl = document.getElementById("errorMsg");
 //      errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
 //    }
 //  });

  // register event listener for submit button
  let button = document.getElementById("submitBtn");
  button.addEventListener("click", onRegister, false);
};

// hit the Amazon Sagemaker endpoint with user inputs
const onRegister = event => {
  event.preventDefault();
  let $error = $("#errorMsg");
  let input = document.getElementById("inputRestaurantName").value;
  // use csv to look up corresponding business id

  const data = {
  	restaurantName: document.getElementById("inputRestaurantName").value
    // inputAddress: document.getElementById("inputAddress").value,
    // inputAddress2: document.getElementById("inputAddress2").value,
    // inputCity: document.getElementById("inputCity").value,
    // inputState: document.getElementById("inputState").value,
    // inputZip: document.getElementById("inputZip").value,
    // price: document.getElementById("price").value,
    // ratingLow: document.getElementById("ratingLow").value,
    // ratingHigh: document.getElementById("ratingHigh").value
    // categories: document.getElementById("categories").value
  };
  let SagemakerEndPoint = ''; // we define the AWS Sagemaker endpoint name
   $.ajax({
      // url: `/endpoints/${SagemakerEndPoint}/invocations`,
      url: `someendpoint`,
      method: "post",
      data: data,
      success: data => {
      	console.log(data);
      },
      error: err => {
        let errorEl = document.getElementById("errorMsg");
        errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
      }
   });
};