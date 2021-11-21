module.exports = ({
   nameUser,
   tipIntencion,
   aNameInt,
   fechaInt,
   horaInt,
   estadoInt
}) => {
   return `
      <!DOCTYPE html>
         <head>
            <meta charset="UTF-8" />
            <meta content="width=device-width, initial-scale=1" name="viewport" />
            <meta name="x-apple-disable-message-reformatting" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta content="telephone=no" name="format-detection" />
            <title>Emails VLP Unesum</title>

            <style>
               #outlook a {
                  padding: 0;
               }

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

               .es-button {
                  /* mso-style-priority: 100 !important; */
                  text-decoration: none !important;
               }

               a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: none !important;
                  font-size: inherit !important;
                  font-family: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
               }

               .es-desk-hidden {
                  display: none;
                  float: left;
                  overflow: hidden;
                  width: 0;
                  max-height: 0;
                  line-height: 0;
                  /* mso-hide: all; */
               }

               .es-button-border:hover a.es-button,
               .es-button-border:hover button.es-button {
                  background: #ffffff !important;
                  border-color: #ffffff !important;
               }

               .es-button-border:hover {
                  background: #ffffff !important;
                  border-style: solid solid solid solid !important;
                  border-color: #3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3 !important;
               }

               [data-ogsb] .es-button {
                  border-width: 0 !important;
                  padding: 15px 20px 15px 20px !important;
               }

               /*
               END OF IMPORTANT
               */
               s {
                  text-decoration: line-through;
               }

               html,
               body {
                  width: 100%;
                  font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
               }

               table {
                  /* mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt; */
                  border-collapse: collapse;
                  border-spacing: 0px;
               }

               table td,
               html,
               body,
               .es-wrapper {
                  padding: 0;
                  Margin: 0;
               }

               .es-content,
               .es-header,
               .es-footer {
                  table-layout: fixed !important;
                  width: 100%;
               }

               img {
                  display: block;
                  border: 0;
                  outline: none;
                  text-decoration: none;
                  -ms-interpolation-mode: bicubic;
               }

               table tr {
                  border-collapse: collapse;
               }

               p,
               hr {
                  Margin: 0;
               }

               h1,
               h2,
               h3,
               h4,
               h5 {
                  Margin: 0;
                  line-height: 120%;
                  /* mso-line-height-rule: exactly; */
                  font-family: arial, 'helvetica neue', helvetica, sans-serif;
               }

               p,
               ul li,
               ol li,
               a {
                  -webkit-text-size-adjust: none;
                  -ms-text-size-adjust: none;
                  /* mso-line-height-rule: exactly; */
               }

               .es-left {
                  float: left;
               }

               .es-right {
                  float: right;
               }

               .es-p5 {
                  padding: 5px;
               }

               .es-p5t {
                  padding-top: 5px;
               }

               .es-p5b {
                  padding-bottom: 5px;
               }

               .es-p5l {
                  padding-left: 5px;
               }

               .es-p5r {
                  padding-right: 5px;
               }

               .es-p10 {
                  padding: 10px;
               }

               .es-p10t {
                  padding-top: 10px;
               }

               .es-p10b {
                  padding-bottom: 10px;
               }

               .es-p10l {
                  padding-left: 10px;
               }

               .es-p10r {
                  padding-right: 10px;
               }

               .es-p15 {
                  padding: 15px;
               }

               .es-p15t {
                  padding-top: 15px;
               }

               .es-p15b {
                  padding-bottom: 15px;
               }

               .es-p15l {
                  padding-left: 15px;
               }

               .es-p15r {
                  padding-right: 15px;
               }

               .es-p20 {
                  padding: 20px;
               }

               .es-p20t {
                  padding-top: 20px;
               }

               .es-p20b {
                  padding-bottom: 20px;
               }

               .es-p20l {
                  padding-left: 20px;
               }

               .es-p20r {
                  padding-right: 20px;
               }

               .es-p25 {
                  padding: 25px;
               }

               .es-p25t {
                  padding-top: 25px;
               }

               .es-p25b {
                  padding-bottom: 25px;
               }

               .es-p25l {
                  padding-left: 25px;
               }

               .es-p25r {
                  padding-right: 25px;
               }

               .es-p30 {
                  padding: 30px;
               }

               .es-p30t {
                  padding-top: 30px;
               }

               .es-p30b {
                  padding-bottom: 30px;
               }

               .es-p30l {
                  padding-left: 30px;
               }

               .es-p30r {
                  padding-right: 30px;
               }

               .es-p35 {
                  padding: 35px;
               }

               .es-p35t {
                  padding-top: 35px;
               }

               .es-p35b {
                  padding-bottom: 35px;
               }

               .es-p35l {
                  padding-left: 35px;
               }

               .es-p35r {
                  padding-right: 35px;
               }

               .es-p40 {
                  padding: 40px;
               }

               .es-p40t {
                  padding-top: 40px;
               }

               .es-p40b {
                  padding-bottom: 40px;
               }

               .es-p40l {
                  padding-left: 40px;
               }

               .es-p40r {
                  padding-right: 40px;
               }

               .es-menu td {
                  border: 0;
               }

               .es-menu td a img {
                  display: inline-block !important;
               }

               /* END CONFIG STYLES */
               a {
                  text-decoration: none;
               }

               p,
               ul li,
               ol li {
                  font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
                  line-height: 150%;
               }

               ul li,
               ol li {
                  Margin-bottom: 15px;
               }

               .es-menu td a {
                  text-decoration: none;
                  display: block;
               }

               .es-wrapper {
                  width: 100%;
                  height: 100%;
                  background-repeat: repeat;
                  background-position: center top;
               }

               .es-wrapper-color {
                  background-color: #fafafa;
               }

               .es-header {
                  background-color: transparent;
                  background-repeat: repeat;
                  background-position: center top;
               }

               .es-header-body {
                  background-color: #ffffff;
               }

               .es-header-body p,
               .es-header-body ul li,
               .es-header-body ol li {
                  color: #333333;
                  font-size: 14px;
               }

               .es-header-body a {
                  color: #1376c8;
                  font-size: 14px;
               }

               .es-content-body {
                  background-color: #ffffff;
               }

               .es-content-body p,
               .es-content-body ul li,
               .es-content-body ol li {
                  color: #666666;
                  font-size: 16px;
               }

               .es-content-body a {
                  color: #0b5394;
                  font-size: 16px;
               }

               .es-footer {
                  background-color: transparent;
                  background-repeat: repeat;
                  background-position: center top;
               }

               .es-footer-body {
                  background-color: transparent;
               }

               .es-footer-body p,
               .es-footer-body ul li,
               .es-footer-body ol li {
                  color: #333333;
                  font-size: 14px;
               }

               .es-footer-body a {
                  color: #333333;
                  font-size: 14px;
               }

               .es-infoblock,
               .es-infoblock p,
               .es-infoblock ul li,
               .es-infoblock ol li {
                  line-height: 120%;
                  font-size: 12px;
                  color: #cccccc;
               }

               .es-infoblock a {
                  font-size: 12px;
                  color: #cccccc;
               }

               h1 {
                  font-size: 20px;
                  font-style: normal;
                  font-weight: normal;
                  color: #333333;
               }

               h2 {
                  font-size: 14px;
                  font-style: normal;
                  font-weight: normal;
                  color: #333333;
               }

               h3 {
                  font-size: 20px;
                  font-style: normal;
                  font-weight: normal;
                  color: #333333;
               }

               .es-header-body h1 a,
               .es-content-body h1 a,
               .es-footer-body h1 a {
                  font-size: 20px;
               }

               .es-header-body h2 a,
               .es-content-body h2 a,
               .es-footer-body h2 a {
                  font-size: 14px;
               }

               .es-header-body h3 a,
               .es-content-body h3 a,
               .es-footer-body h3 a {
                  font-size: 20px;
               }

               a.es-button,
               button.es-button {
                  border-style: solid;
                  border-color: #ffffff;
                  border-width: 15px 20px 15px 20px;
                  display: inline-block;
                  background: #ffffff;
                  border-radius: 10px;
                  font-size: 14px;
                  font-family: arial, 'helvetica neue', helvetica, sans-serif;
                  font-weight: bold;
                  font-style: normal;
                  line-height: 120%;
                  color: #3D5CA3;
                  text-decoration: none;
                  width: auto;
                  text-align: center;
               }

               .es-button-border {
                  border-style: solid solid solid solid;
                  border-color: #3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3;
                  background: #ffffff;
                  border-width: 2px 2px 2px 2px;
                  display: inline-block;
                  border-radius: 10px;
                  width: auto;
               }

               @media only screen and (max-width: 600px) {

                  p,
                  ul li,
                  ol li,
                  a {
                     line-height: 150% !important;
                  }

                  h1 {
                     font-size: 20px !important;
                     text-align: center;
                     line-height: 120% !important;
                  }

                  h2 {
                     font-size: 16px !important;
                     text-align: left;
                     line-height: 120% !important;
                  }

                  h3 {
                     font-size: 20px !important;
                     text-align: center;
                     line-height: 120% !important;
                  }

                  .es-header-body h1 a,
                  .es-content-body h1 a,
                  .es-footer-body h1 a {
                     font-size: 20px !important;
                  }

                  h2 a {
                     text-align: left;
                  }

                  .es-header-body h2 a,
                  .es-content-body h2 a,
                  .es-footer-body h2 a {
                     font-size: 16px !important;
                  }

                  .es-header-body h3 a,
                  .es-content-body h3 a,
                  .es-footer-body h3 a {
                     font-size: 20px !important;
                  }

                  .es-menu td a {
                     font-size: 14px !important;
                  }

                  .es-header-body p,
                  .es-header-body ul li,
                  .es-header-body ol li,
                  .es-header-body a {
                     font-size: 10px !important;
                  }

                  .es-content-body p,
                  .es-content-body ul li,
                  .es-content-body ol li,
                  .es-content-body a {
                     font-size: 16px !important;
                  }

                  .es-footer-body p,
                  .es-footer-body ul li,
                  .es-footer-body ol li,
                  .es-footer-body a {
                     font-size: 12px !important;
                  }

                  .es-infoblock p,
                  .es-infoblock ul li,
                  .es-infoblock ol li,
                  .es-infoblock a {
                     font-size: 12px !important;
                  }

                  *[class="gmail-fix"] {
                     display: none !important;
                  }

                  .es-m-txt-c,
                  .es-m-txt-c h1,
                  .es-m-txt-c h2,
                  .es-m-txt-c h3 {
                     text-align: center !important;
                  }

                  .es-m-txt-r,
                  .es-m-txt-r h1,
                  .es-m-txt-r h2,
                  .es-m-txt-r h3 {
                     text-align: right !important;
                  }

                  .es-m-txt-l,
                  .es-m-txt-l h1,
                  .es-m-txt-l h2,
                  .es-m-txt-l h3 {
                     text-align: left !important;
                  }

                  .es-m-txt-r img,
                  .es-m-txt-c img,
                  .es-m-txt-l img {
                     display: inline !important;
                  }

                  .es-button-border {
                     display: block !important;
                  }

                  a.es-button,
                  button.es-button {
                     font-size: 14px !important;
                     display: block !important;
                     border-left-width: 0px !important;
                     border-right-width: 0px !important;
                  }

                  .es-btn-fw {
                     border-width: 10px 0px !important;
                     text-align: center !important;
                  }

                  .es-adaptive table,
                  .es-btn-fw,
                  .es-btn-fw-brdr,
                  .es-left,
                  .es-right {
                     width: 100% !important;
                  }

                  .es-content table,
                  .es-header table,
                  .es-footer table,
                  .es-content,
                  .es-footer,
                  .es-header {
                     width: 100% !important;
                     max-width: 600px !important;
                  }

                  .es-adapt-td {
                     display: block !important;
                     width: 100% !important;
                  }

                  .adapt-img {
                     width: 100% !important;
                     height: auto !important;
                  }

                  .es-m-p0 {
                     padding: 0 !important;
                  }

                  .es-m-p0r {
                     padding-right: 0 !important;
                  }

                  .es-m-p0l {
                     padding-left: 0 !important;
                  }

                  .es-m-p0t {
                     padding-top: 0 !important;
                  }

                  .es-m-p0b {
                     padding-bottom: 0 !important;
                  }

                  .es-m-p20b {
                     padding-bottom: 20px !important;
                  }

                  .es-mobile-hidden,
                  .es-hidden {
                     display: none !important;
                  }

                  tr.es-desk-hidden,
                  td.es-desk-hidden,
                  table.es-desk-hidden {
                     width: auto !important;
                     overflow: visible !important;
                     float: none !important;
                     max-height: inherit !important;
                     line-height: inherit !important;
                  }

                  tr.es-desk-hidden {
                     display: table-row !important;
                  }

                  table.es-desk-hidden {
                     display: table !important;
                  }

                  td.es-desk-menu-hidden {
                     display: table-cell !important;
                  }

                  .es-menu td {
                     width: 1% !important;
                  }

                  table.es-table-not-adapt,
                  .esd-block-html table {
                     width: auto !important;
                  }

                  table.es-social {
                     display: inline-block !important;
                  }

                  table.es-social td {
                     display: inline-block !important;
                  }

                  .es-m-p5 {
                     padding: 5px !important;
                  }

                  .es-m-p5t {
                     padding-top: 5px !important;
                  }

                  .es-m-p5b {
                     padding-bottom: 5px !important;
                  }

                  .es-m-p5r {
                     padding-right: 5px !important;
                  }

                  .es-m-p5l {
                     padding-left: 5px !important;
                  }

                  .es-m-p10 {
                     padding: 10px !important;
                  }

                  .es-m-p10t {
                     padding-top: 10px !important;
                  }

                  .es-m-p10b {
                     padding-bottom: 10px !important;
                  }

                  .es-m-p10r {
                     padding-right: 10px !important;
                  }

                  .es-m-p10l {
                     padding-left: 10px !important;
                  }

                  .es-m-p15 {
                     padding: 15px !important;
                  }

                  .es-m-p15t {
                     padding-top: 15px !important;
                  }

                  .es-m-p15b {
                     padding-bottom: 15px !important;
                  }

                  .es-m-p15r {
                     padding-right: 15px !important;
                  }

                  .es-m-p15l {
                     padding-left: 15px !important;
                  }

                  .es-m-p20 {
                     padding: 20px !important;
                  }

                  .es-m-p20t {
                     padding-top: 20px !important;
                  }

                  .es-m-p20r {
                     padding-right: 20px !important;
                  }

                  .es-m-p20l {
                     padding-left: 20px !important;
                  }

                  .es-m-p25 {
                     padding: 25px !important;
                  }

                  .es-m-p25t {
                     padding-top: 25px !important;
                  }

                  .es-m-p25b {
                     padding-bottom: 25px !important;
                  }

                  .es-m-p25r {
                     padding-right: 25px !important;
                  }

                  .es-m-p25l {
                     padding-left: 25px !important;
                  }

                  .es-m-p30 {
                     padding: 30px !important;
                  }

                  .es-m-p30t {
                     padding-top: 30px !important;
                  }

                  .es-m-p30b {
                     padding-bottom: 30px !important;
                  }

                  .es-m-p30r {
                     padding-right: 30px !important;
                  }

                  .es-m-p30l {
                     padding-left: 30px !important;
                  }

                  .es-m-p35 {
                     padding: 35px !important;
                  }

                  .es-m-p35t {
                     padding-top: 35px !important;
                  }

                  .es-m-p35b {
                     padding-bottom: 35px !important;
                  }

                  .es-m-p35r {
                     padding-right: 35px !important;
                  }

                  .es-m-p35l {
                     padding-left: 35px !important;
                  }

                  .es-m-p40 {
                     padding: 40px !important;
                  }

                  .es-m-p40t {
                     padding-top: 40px !important;
                  }

                  .es-m-p40b {
                     padding-bottom: 40px !important;
                  }

                  .es-m-p40r {
                     padding-right: 40px !important;
                  }

                  .es-m-p40l {
                     padding-left: 40px !important;
                  }
               }

               /* END RESPONSIVE STYLES */
               .es-p-default {
                  padding-top: 20px;
                  padding-right: 20px;
                  padding-bottom: 10px;
                  padding-left: 20px;
               }

               .es-p-all-default {
                  padding: 0px;
               }
            </style>

         </head>

         <body>
            <div class="es-wrapper-color">
               <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                     <tr>
                        <td class="esd-email-paddings" valign="top">
                           <table
                              cellpadding="0"
                              cellspacing="0"
                              class="es-content esd-header-popover"
                              align="center"
                           >
                              <tbody>
                                 <tr>
                                    <td
                                       class="es-adaptive esd-stripe"
                                       align="center"
                                       esd-custom-block-id="88589"
                                       bgcolor="#F6F6F6"
                                       style="background-color: #f6f6f6"
                                    >
                                       <table
                                          class="es-content-body"
                                          style="
                                             border-top: 10px solid transparent;
                                             background-color: transparent;
                                          "
                                          width="600"
                                          cellspacing="0"
                                          cellpadding="0"
                                          bgcolor="#ffffff"
                                          align="center"
                                       >
                                          <tbody>
                                             <tr>
                                                <td
                                                   class="
                                                      esd-structure
                                                      es-p10t es-p10b es-p20r es-p20l
                                                   "
                                                   style="background-color: #7a9ef8"
                                                   bgcolor="#7a9ef8"
                                                   align="left"
                                                >
                                                   <table
                                                      width="100%"
                                                      cellspacing="0"
                                                      cellpadding="0"
                                                   >
                                                      <tbody>
                                                         <tr>
                                                            <td
                                                               class="
                                                                  esd-container-frame
                                                               "
                                                               width="560"
                                                               valign="top"
                                                               align="center"
                                                            >
                                                               <table
                                                                  width="100%"
                                                                  cellspacing="0"
                                                                  cellpadding="0"
                                                               >
                                                                  <tbody>
                                                                     <tr>
                                                                        <td
                                                                           class="
                                                                              esd-block-text
                                                                           "
                                                                           align="left"
                                                                        >
                                                                           <h2
                                                                              style="
                                                                                 color: #ffffff;
                                                                                 font-size: 22px;
                                                                                 font-family: 'comic sans ms',
                                                                                    'marker felt-thin',
                                                                                    arial,
                                                                                    sans-serif;
                                                                              "
                                                                           >
                                                                              <strong
                                                                                 >SMM Iglesia</strong
                                                                              >
                                                                           </h2>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                           <table
                              class="es-content esd-footer-popover"
                              cellspacing="0"
                              cellpadding="0"
                              align="center"
                           >
                              <tbody>
                                 <tr>
                                    <td
                                       class="esd-stripe"
                                       style="background-color: #f6f6f6"
                                       bgcolor="#F6F6F6"
                                       align="center"
                                    >
                                       <table
                                          class="es-content-body"
                                          style="
                                             border-bottom: 10px solid #f6f6f6;
                                             background-color: #ffffff;
                                          "
                                          width="600"
                                          cellspacing="0"
                                          cellpadding="0"
                                          bgcolor="#ffffff"
                                          align="center"
                                       >
                                          <tbody>
                                             <tr>
                                                <td
                                                   class="
                                                      esd-structure
                                                      es-p15t es-p20r es-p20l
                                                   "
                                                   style="
                                                      background-color: transparent;
                                                   "
                                                   bgcolor="transparent"
                                                   align="left"
                                                >
                                                   <table
                                                      width="100%"
                                                      cellspacing="0"
                                                      cellpadding="0"
                                                   >
                                                      <tbody>
                                                         <tr>
                                                            <td
                                                               class="
                                                                  esd-container-frame
                                                               "
                                                               width="560"
                                                               valign="top"
                                                               align="center"
                                                            >
                                                               <table
                                                                  style="
                                                                     background-position: left
                                                                        top;
                                                                  "
                                                                  width="100%"
                                                                  cellspacing="0"
                                                                  cellpadding="0"
                                                               >
                                                                  <tbody>
                                                                     <tr>
                                                                        <td
                                                                           class="
                                                                              esd-block-image
                                                                              es-p15t
                                                                              es-p15b
                                                                              es-p10r
                                                                              es-p10l
                                                                           "
                                                                           align="center"
                                                                           style="
                                                                              font-size: 0px;
                                                                           "
                                                                        >
                                                                           <a
                                                                              target="_blank"
                                                                              ><img
                                                                                 src="https://drive.google.com/uc?export=view&id=16yXk-jYPawir1QAyj0DOdqOyYBhjbOBd"
                                                                                 alt
                                                                                 style="
                                                                                    display: block;
                                                                                 "
                                                                                 width="120"
                                                                           /></a>
                                                                        </td>
                                                                     </tr>
                                                                     <tr>
                                                                        <td
                                                                           class="
                                                                              esd-block-text
                                                                              es-p5t
                                                                              es-p5b
                                                                              es-p10r
                                                                              es-p10l
                                                                           "
                                                                           align="center"
                                                                        >
                                                                           <h1
                                                                              style="
                                                                                 color: #333333;
                                                                                 font-size: 18px;
                                                                                 text-align: left;
                                                                                 font-family: 'comic sans ms',
                                                                                    'marker felt-thin',
                                                                                    arial,
                                                                                    sans-serif;
                                                                              "
                                                                           >
                                                                              <b
                                                                                 >Hola, </b
                                                                              >${nameUser}
                                                                           </h1>
                                                                        </td>
                                                                     </tr>
                                                                     <tr>
                                                                        <td
                                                                           class="
                                                                              esd-block-text
                                                                              es-p10t
                                                                              es-p5b
                                                                              es-p15r
                                                                              es-p15l
                                                                           "
                                                                           align="left"
                                                                        >
                                                                           <p
                                                                              style="
                                                                                 font-size: 13px;
                                                                                 font-family: 'comic sans ms',
                                                                                    'marker felt-thin',
                                                                                    arial,
                                                                                    sans-serif;
                                                                                 color: #696969;
                                                                              "
                                                                           >
                                                                              Su solicitud a la intencion ${tipIntencion}, a nombre de ${aNameInt}, para el dia ${fechaInt} ${horaInt}, ha sido ${estadoInt}.
                                                                           </p>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                             <tr>
                                                <td
                                                   class="
                                                      esd-structure
                                                      es-p10t es-p20b es-p20r es-p20l
                                                   "
                                                   align="left"
                                                >
                                                   <table
                                                      cellpadding="0"
                                                      cellspacing="0"
                                                      class="es-left"
                                                      align="left"
                                                   >
                                                      <tbody>
                                                         <tr>
                                                            <td
                                                               width="130"
                                                               class="
                                                                  es-m-p0r es-m-p20b
                                                                  esd-container-frame
                                                               "
                                                               valign="top"
                                                               align="center"
                                                            >
                                                               <table
                                                                  cellpadding="0"
                                                                  cellspacing="0"
                                                                  width="100%"
                                                               >
                                                                  <tbody>
                                                                     <tr>
                                                                        <td
                                                                           class="
                                                                              esd-block-image
                                                                              made_with
                                                                              es-p10
                                                                           "
                                                                           align="center"
                                                                           style="
                                                                              font-size: 0px;
                                                                           "
                                                                        >
                                                                           <a
                                                                              target="_blank"
                                                                              href="https://viewstripo.email/?utm_source=templates&utm_medium=email&utm_campaign=education&utm_content=trigger_newsletter2"
                                                                              ><img
                                                                                 src="https://drive.google.com/uc?export=view&id=1VncrHTV5fwenFSPWjgjcDP25VYOBwXjF"
                                                                                 alt
                                                                                 style="
                                                                                    display: block;
                                                                                 "
                                                                                 height="60"
                                                                           /></a>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <table
                                                      cellpadding="0"
                                                      cellspacing="0"
                                                      align="right"
                                                   >
                                                      <tbody>
                                                         <tr>
                                                            <td
                                                               width="420"
                                                               align="left"
                                                               class="
                                                                  esd-container-frame
                                                               "
                                                            >
                                                               <table
                                                                  cellpadding="0"
                                                                  cellspacing="0"
                                                                  width="100%"
                                                               >
                                                                  <tbody>
                                                                     <tr>
                                                                        <td
                                                                           class="
                                                                              esd-block-text
                                                                              es-p5t
                                                                              es-p5b
                                                                           "
                                                                           align="center"
                                                                        >
                                                                           <p
                                                                              style="
                                                                                 font-size: 11px;
                                                                                 font-family: 'comic sans ms',
                                                                                    'marker felt-thin',
                                                                                    arial,
                                                                                    sans-serif;
                                                                              "
                                                                           >
                                                                              <strong
                                                                                 >PARROQUIA SANTA MARÍA MADRE</strong
                                                                              >
                                                                           </p>
                                                                           <p
                                                                              style="
                                                                                 text-transform: uppercase;
                                                                                 font-size: 11px;
                                                                                 font-family: 'comic sans ms',
                                                                                    'marker felt-thin',
                                                                                    arial,
                                                                                    sans-serif;
                                                                              "
                                                                           >
                                                                           Av. Alejo Lascano, barrio la Dolorosa, frente a la Cdla. La Fae
                                                                           </p>
                                                                           <p
                                                                              style="
                                                                                 font-size: 11px;
                                                                                 font-family: 'comic sans ms',
                                                                                    'marker felt-thin',
                                                                                    arial,
                                                                                    sans-serif;
                                                                              "
                                                                           >
                                                                              <strong
                                                                                 >JIPIJAPA
                                                                                 -
                                                                                 MANABÍ
                                                                                 -
                                                                                 ECUADOR</strong
                                                                              >
                                                                           </p>
                                                                        </td>
                                                                     </tr>
                                                                     <tr>
                                                                        <td
                                                                           class="
                                                                              esd-block-text
                                                                              es-m-txt-c
                                                                              es-p5r
                                                                              es-p5l
                                                                              es-m-p0
                                                                           "
                                                                           esd-links-color="#00ce8d"
                                                                           esd-links-underline="none"
                                                                           align="center"
                                                                        >
                                                                           <p
                                                                              style="
                                                                                 color: #7a9ef8;
                                                                                 font-size: 12px;
                                                                                 font-family: 'comic sans ms',
                                                                                    'marker felt-thin',
                                                                                    arial,
                                                                                    sans-serif;
                                                                              "
                                                                           >
                                                                              <strong
                                                                                 >COPYRIGHT
                                                                                 © InnovaTech'S&nbsp;2021 <br>
                                                                                 All rights reserved
                                                                              </strong
                                                                              >
                                                                           </p>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </body>
      </html>
   `;
};