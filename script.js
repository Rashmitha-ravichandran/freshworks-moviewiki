window.onhashchange = function() {
  console.log("hello back!");
  console.log(window.location.href);

  if (window.location.href.split("#") != undefined) {
    console.log(window.location.href.split("#"));
  } else {
    console.log("hello");
  }
};
