const validateCed = (cad) => {
   var total = 0;
   var longitud = cad.length;
   var longcheck = longitud - 1;
   for (var i = 0; i < longcheck; i++) {
      if (i % 2 === 0) {
         var aux = cad.charAt(i) * 2;
         if (aux > 9) aux -= 9;
         total += aux;
      } else {
         total += parseInt(cad.charAt(i));
      }
   }
   total = total % 10 ? 10 - total % 10 : 0;
   if (cad.charAt(longitud - 1) == total) {
      return true;
   } else {
      return false;
   }
};

const cedulaVal = (cedula) => {
   var cedulaRegex =
      /^[0-9]+$/;
   if (cedulaRegex.test(cedula)) {
      if (cedula.length === 10) {
         return validateCed(cedula);
      } else {
         return false;
      }
   }
   return false;
};

const emailVer = (correo) => {
   var emailRegex =
      /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   if (!emailRegex.test(correo)) {
      return false;
   }
   return true;
};

module.exports = ({
   cedulaVal,
   emailVer
});