'use strict';

const onLoad = () => {
  // register event listener for submit button
  let submitButton = document.getElementById("submitBtn");
  let lookupButton = document.getElementById("lookupBtn");
  submitButton.addEventListener("click", onRegister, false);
  lookupButton.addEventListener("click", onLookup, false);
};

// pull user reviews
const onLookup = event => {
  event.preventDefault();
  let $error = $("#errorMsg");
	let params = document.getElementById("inputUsername").value;
	$.ajax({
	      url: `/v1/user/${params}`,
	      method: "get",
	      success: data => {
	      	// console.log(data);
		      let $reviews = $("#reviews");
		      data.forEach(review => {
		        $reviews.append(`<tr>
		        	<th>${review[0]}</th>
		            <th>${review[1]}</th>
		        </tr>`);
		      });
	      },
	      error: err => {
	        let errorEl = document.getElementById("errorMsg");
	        errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
	      }
	   });
};

// hit the Amazon Sagemaker endpoint with user inputs
const onRegister = event => {
  event.preventDefault();
  let $error = $("#errorMsg");
  const data = {
  	restaurantName: document.getElementById("inputRestaurantName").value
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