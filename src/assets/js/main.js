window.onscroll = function () {
  scrollFunction()
};
let topbutton = document.getElementById("myBtn");
function scrollFunction() {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
          document.getElementById("navbar").style.backgroundColor = "#141414";
      } else {
          document.getElementById("navbar").style.backgroundColor = "";
      }
  }
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      topbutton.style.opacity="1"
      topbutton.style.visibility="visible"

  } else {
      topbutton.style.opacity="0"
      topbutton.style.visibility="hidden"
  }
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
