var uiDemo = function() {
  this.data = JSON.parse(this.readJSON('json/carousel-data.json'));
  this.renderView();
  this.pageContent();
};
uiDemo.prototype.readJSON = function(file) {
  var request = new XMLHttpRequest();
  request.open('GET', file, false);
  request.send(null);
  if (request.status == 200)
      return request.responseText;
};
uiDemo.prototype.renderView = function() {
  var content = {
    heading : 'Home',
    imagePath : 'images/item-2.png',
    pageContent : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac gravida arcu, quis auctor elit. Praesent vestibulum vitae odio in eleifend. Duis laoreet odio sed ligula pulvinar, sed interdum neque feugiat. Curabitur id auctor mauris, ut ultricies est. Praesent congue viverra eros, sit amet fermentum odio semper id. Aliquam vestibulum dapibus dolor. In accumsan purus a pellentesque faucibus. Sed convallis ante non neque pretium, sed imperdiet risus dignissim. Nullam porttitor, mi vel viverra vulputate, arcu nunc tincidunt arcu, ut luctus lorem mauris eu velit. Nullam lobortis at felis iaculis gravida. Integer est libero, varius eu dictum ullamcorper, malesuada eu nibh. Vestibulum id erat iaculis, malesuada quam sed, tempus quam. Sed id malesuada ipsum. Nam condimentum, magna eget molestie elementum, nisl diam fermentum nunc, in hendrerit metus orci aliquet ante. Nunc tincidunt elementum suscipit. Nam vel fringilla nulla.'
  };
  var template = Handlebars.compile($('#nav-template').html());
  var temp = template(this.data);
  $('#top-div').append(temp);
  
  var template = Handlebars.compile($('#content').html());
  var temp = template(content);
  $('#bottom-div').append(temp);
  $('#contactus-form').bind('submit', this.validate());
};
uiDemo.prototype.pageContent = function() {
  var object = this;
  $('.link').click(function(event){
    if($(event.target).text() == object.data[$(event.target).attr('id')]['heading']) {
      content = {
        heading : object.data[$(event.target).attr('id')]['heading'], 
        imagePath : object.data[$(event.target).attr('id')]['image'],
        pageContent : object.data[$(event.target).attr('id')]['text']
      };
      template = Handlebars.compile($('#content').html());
      temp = template(content);
      $('#page-contents').html(temp);
      $('#contactus-form').bind('submit', object.validate());
    }
  });
};

uiDemo.prototype.validate = function() {
//validate contact us form on submit.
  $("#contactus-form").validate({
    rules: {
      name: "required",
      password: {
        required: true,
        minlength: 5
      },
      confirmpassword: {
        required: true,
        minlength: 5,
        equalTo: "#password"
      },
      email: {
        required: true,
        email: true
      },
      website: "required",
    },
    messages: {
      name: "Please enter your name",
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long"
      },
      confirmpassword: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long",
        equalTo: "Please enter the same password as above"
      },
      email: "Please enter a valid email address",
      website: "Please enter your website url."
    },
    submitHandler: function() {
      $('.form-msg').css({'display': 'block', 'visibility' : 'visible'});
    }
  });
};
