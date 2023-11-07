|%
::
::  XX should add a +default-text with the intro / tutorial blog post
++  default-theme
  ^-  @t
  '''
  h1, h2, h3, h4, h5, h6 {
    color : black;
    text-align: center;
  }
  p {
    text-align: justify;
  }
  img {
    margin: auto;
    max-height: 300px;
    display: block;
  }
  body {
    margin : 7vw;
    font-size : 3vh;
    color: #393939;
    background-color: white;
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