import{setupVideoPosts}from"./video-posts-control.js";window.onload=()=>{addSearchField(setupVideoPosts),startDarkModeFunctionality(addDarkModeButton()),activateMenu(),handleContactForm()};function handleContactForm(){emailjs.init("user_i4mTPF2ENuhqRVXN69p8L");var a=document.forms["contact-form"],b=a[0],c=a[1],d=a[2],f=a[3],g=a[4];a.addEventListener("submit",b=>{b.preventDefault();var c=!0;for(var d in data){var e=data[d].trim(),g=a[d].pattern;if(g&&null===e.match(new RegExp(g))||"message"===d&&30>e.length){a[d].nextElementSibling.textContent=a[d].title,a[d].classList.add("has-error"),c=!1;break}}c&&0===f.value.length&&(doOnProductionOnly(()=>gtag("event","contact-form-attempt",{event_category:"contact",event_label:"contact form filled and submitted"})),grecaptcha.execute())});var h=a=>{data[a.target.name]=a.target.value,a.target.nextElementSibling.textContent="",a.target.classList.remove("has-error"),Object.values(data).every(a=>0<a.trim().length)?g.removeAttribute("disabled"):g.setAttribute("disabled","disabled")};[b,c,d].forEach(a=>{data[a.name]="",a.addEventListener("input",h),a.addEventListener("change",h)})}