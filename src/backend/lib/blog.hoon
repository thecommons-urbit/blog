|%
::
::  XX should add a +default-text with the intro / tutorial blog post
++  default-theme
  ^-  @t
  '''
  body {
    margin: 5vh 5vw 5vh 5vw;
    max-width: 650px;
    font-size: 19px;
    text-align: left-align;
    background-color: #fefefe;
  }

  h1, h2, h3, h4, h5, h6, p {
    color: #010101;
  }

  code {
    color: #010101;
    background-color: #e5e5e5;
    font-size: 16px;
  }

  img {
    margin: auto;
    max-height: 100%;
    max-width: 100%;
    display: block;
  }
  '''
::
++  add-style
  |=  css=@t
  ^-  @t
  (cat 3 (cat 3 '<style>' css) '</style>')
::
++  http-response-cards
  |=  [id=@tas hed=response-header:http data=(unit octs)]
  ^-  (list card:agent:gall)
  =/  paths  [/http-response/[id]]~
  :~  [%give %fact paths %http-response-header !>(hed)]
      [%give %fact paths %http-response-data !>(data)]
      [%give %kick paths ~]
  ==
--
