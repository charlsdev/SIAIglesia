module.exports = ({
   nameUser,
   estadoNew
}) => {
   return `
      <!DOCTYPE html>
         <html>
            <head>
               <meta name="viewport" content="width=device-width" />
               <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
               <title>Simple Transactional Email</title>
               <style>
                  /* -------------------------------------
                     GLOBAL RESETS
                  ------------------------------------- */
         
                  /*All the styling goes here*/
         
                  img {
                     border: none;
                     -ms-interpolation-mode: bicubic;
                     max-width: 100%;
                  }
         
                  body {
                     background-color: #f6f6f6;
                     font-family: sans-serif;
                     -webkit-font-smoothing: antialiased;
                     font-size: 14px;
                     line-height: 1.4;
                     margin: 0;
                     padding: 0;
                     -ms-text-size-adjust: 100%;
                     -webkit-text-size-adjust: 100%;
                  }
         
                  table {
                     border-collapse: separate;
                     mso-table-lspace: 0pt;
                     mso-table-rspace: 0pt;
                     width: 100%;
                  }
                  table td {
                     font-family: sans-serif;
                     font-size: 14px;
                     vertical-align: top;
                  }
         
                  /* -------------------------------------
                     BODY & CONTAINER
                  ------------------------------------- */
         
                  .body {
                     background-color: #f6f6f6;
                     width: 100%;
                  }
         
                  /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
                  .container {
                     display: block;
                     margin: 0 auto !important;
                     /* makes it centered */
                     max-width: 580px;
                     padding: 10px;
                     width: 580px;
                  }
         
                  /* This should also be a block element, so that it will fill 100% of the .container */
                  .content {
                     box-sizing: border-box;
                     display: block;
                     margin: 0 auto;
                     max-width: 580px;
                     padding: 10px;
                  }
         
                  /* -------------------------------------
                     HEADER, FOOTER, MAIN
                  ------------------------------------- */
                  .main {
                     background: #ffffff;
                     border-radius: 3px;
                     width: 100%;
                  }
         
                  .wrapper {
                     box-sizing: border-box;
                     padding: 20px;
                  }
         
                  .content-block {
                     padding-bottom: 10px;
                     padding-top: 10px;
                  }
         
                  .footer {
                     clear: both;
                     margin-top: 10px;
                     text-align: center;
                     width: 100%;
                  }
                  .footer td,
                  .footer p,
                  .footer span,
                  .footer a {
                     color: #999999;
                     font-size: 12px;
                     text-align: center;
                  }
         
                  /* -------------------------------------
                     TYPOGRAPHY
                  ------------------------------------- */
                  h1,
                  h2,
                  h3,
                  h4 {
                     color: #000000;
                     font-family: sans-serif;
                     font-weight: 600 !important;
                     /* line-height: 1.4; */
                     margin: 10px 25px;
                     /* margin-bottom: 30px; */
                  }
         
                  img {
                     margin-top: 15px;
                  }
         
                  h1 {
                     font-size: 20px;
                     font-weight: 300;
                     /* text-align: center; */
                     text-transform: capitalize;
                  }
         
                  p,
                  ul,
                  ol {
                     font-family: sans-serif;
                     font-size: 14px;
                     font-weight: normal;
                     margin: 0;
                     margin-bottom: 15px;
                  }
                  p li,
                  ul li,
                  ol li {
                     list-style-position: inside;
                     margin-left: 5px;
                  }
         
                  a {
                     color: rgb(122, 158, 248, 0.8);
                     text-decoration: underline;
                  }
         
                  /* -------------------------------------
                     BUTTONS
                  ------------------------------------- */
                  .btn {
                     box-sizing: border-box;
                     width: 100%;
                  }
                  .btn > tbody > tr > td {
                     padding-bottom: 15px;
                  }
                  .btn table {
                     width: auto;
                  }
                  .btn table td {
                     background-color: #ffffff;
                     border-radius: 5px;
                     text-align: center;
                  }
                  .btn a {
                     background-color: #ffffff;
                     border: solid 1px rgb(122, 158, 248, 0.8);
                     border-radius: 5px;
                     box-sizing: border-box;
                     color: rgb(122, 158, 248, 0.8);
                     cursor: pointer;
                     display: inline-block;
                     font-size: 14px;
                     font-weight: bold;
                     margin: 0;
                     padding: 12px 25px;
                     text-decoration: none;
                     text-transform: capitalize;
                  }
         
                  .btn-primary table td {
                     background-color: rgb(122, 158, 248, 0.8);
                  }
         
                  .btn-primary a {
                     background-color: rgb(122, 158, 248, 0.8);
                     border-color: rgb(122, 158, 248, 0.8);
                     color: #ffffff;
                  }
         
                  /* -------------------------------------
                     OTHER STYLES THAT MIGHT BE USEFUL
                  ------------------------------------- */
                  .last {
                     margin-bottom: 0;
                  }
         
                  .first {
                     margin-top: 0;
                  }
         
                  .align-center {
                     text-align: center;
                  }
         
                  .align-right {
                     text-align: right;
                  }
         
                  .align-left {
                     text-align: left;
                  }
         
                  .clear {
                     clear: both;
                  }
         
                  .mt0 {
                     margin-top: 0;
                  }
         
                  .mb0 {
                     margin-bottom: 0;
                  }
         
                  .preheader {
                     color: transparent;
                     display: none;
                     height: 0;
                     max-height: 0;
                     max-width: 0;
                     opacity: 0;
                     overflow: hidden;
                     /* mso-hide: all; */
                     visibility: hidden;
                     width: 0;
                  }
         
                  .powered-by a {
                     text-decoration: none;
                  }
         
                  hr {
                     border: 0;
                     border-bottom: 1px solid #d6d6d6;
                     margin: 5px 0;
                  }
         
                  /* -------------------------------------
                     RESPONSIVE AND MOBILE FRIENDLY STYLES
                  ------------------------------------- */
                  @media only screen and (max-width: 620px) {
                     table[class="body"] h1 {
                        font-size: 18px !important;
                        margin-bottom: 10px !important;
                     }
                     /* table[class="body"] p,
                     table[class="body"] ul,
                     table[class="body"] ol,
                     table[class="body"] td,
                     table[class="body"] span,
                     table[class="body"] a {
                        font-size: 16px !important;
                     } */
                     table[class="body"] .wrapper,
                     table[class="body"] .article {
                        padding: 10px !important;
                     }
                     table[class="body"] .content {
                        padding: 0 !important;
                     }
                     table[class="body"] .container {
                        padding: 0 !important;
                        width: 100% !important;
                     }
                     table[class="body"] .main {
                        border-left-width: 0 !important;
                        border-radius: 0 !important;
                        border-right-width: 0 !important;
                     }
                     table[class="body"] .btn table {
                        width: 100% !important;
                     }
                     table[class="body"] .btn a {
                        width: 100% !important;
                     }
                     table[class="body"] .img-responsive {
                        height: auto !important;
                        max-width: 100% !important;
                        width: auto !important;
                     }
                  }
         
                  /* -------------------------------------
                  PRESERVE THESE STYLES IN THE HEAD
                  ------------------------------------- */
                  @media all {
                     .ExternalClass {
                        width: 100%;
                     }
                     .ExternalClass,
                     .ExternalClass p,
                     .ExternalClass span,
                     .ExternalClass font,
                     .ExternalClass td,
                     .ExternalClass div {
                        line-height: 100%;
                     }
                     .apple-link a {
                        color: inherit !important;
                        font-family: inherit !important;
                        font-size: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                        text-decoration: none !important;
                     }
                     #MessageViewBody a {
                        color: inherit;
                        text-decoration: none;
                        font-size: inherit;
                        font-family: inherit;
                        font-weight: inherit;
                        line-height: inherit;
                     }
                     .btn-primary table td:hover {
                        background-color: #35e9d4 !important;
                     }
                     .btn-primary a:hover {
                        background-color: #35e9d4 !important;
                        border-color: #35e9d4 !important;
                     }
                  }
               </style>
            </head>
            <body class="">
               <span class="preheader"
                  >This is preheader text. Some clients will show this text as a
                  preview.</span
               >
               <table
                  role="presentation"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="body"
               >
                  <tr>
                     <td>&nbsp;</td>
                     <td class="container">
                        <div class="content">
                           <!-- START CENTERED WHITE CONTAINER -->
                           <table role="presentation" class="main">
                              <!-- START MAIN CONTENT AREA -->
                              <tr>
                                 <td class="wrapper">
                                    <table
                                       role="presentation"
                                       border="0"
                                       cellpadding="0"
                                       cellspacing="0"
                                    >
                                       <tr>
                                          <td style="background-color: rgb(122, 158, 248, 0.8);">
                                             <h1 style="color: #fff;">
                                                SANTA MARÍA MADRE
                                             </h1>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td>
                                             <center>
                                                <img src="https://drive.google.com/uc?export=view&id=16yXk-jYPawir1QAyj0DOdqOyYBhjbOBd" alt="Escudo de la UNESUM" style="width: 105px;">
                                             </center>
                                             <hr>
                                             <p style="font-size: 1.3rem; font-weight: 600;">Cuenta ${estadoNew},</p>

                                             <p>
                                                Sr(a). <strong>${nameUser}</strong>, su cuenta ha sido <strong>${estadoNew}</strong>, en tal caso de que se trate de un error, comuniquese con el departamento de sistema.
                                             </p>

                                             <p>Buena Suerte!</p>
                                             
                                             <center>
                                                <p style="font-size: .9rem; font-weight: 600;">
                                                   Parroquia Santa María Madre
                                                </p>
                                             </center>
                                          </td>
                                       </tr>
                                    </table>
                                 </td>
                              </tr>
         
                              <!-- END MAIN CONTENT AREA -->
                           </table>
                           <!-- END CENTERED WHITE CONTAINER -->
         
                           <!-- START FOOTER -->
                           <div class="footer">
                              <table
                                 role="presentation"
                                 border="0"
                                 cellpadding="0"
                                 cellspacing="0"
                              >
                                 <tr>
                                    <td class="content-block">
                                       <span class="apple-link"
                                          >Av. Alejo Lascano, barrio la Dolorosa, frente a la Cdla. La Fae</span
                                       >
                                       <br />
                                       Visita nuestra página
                                       <a href="https://santamariamadre.me"
                                          >SMM Iglesia</a
                                       >.
                                    </td>
                                 </tr>
                                 <tr>
                                    <td class="content-block powered-by">
                                       Creado por
                                       <strong>InnovaTech'S</strong>.
                                    </td>
                                 </tr>
                              </table>
                           </div>
                           <!-- END FOOTER -->
                        </div>
                     </td>
                     <td>&nbsp;</td>
                  </tr>
               </table>
            </body>
         </html>
   `;
};