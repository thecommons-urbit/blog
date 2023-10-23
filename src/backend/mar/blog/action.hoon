/-  blog
::
|_  =action:blog
++  grab
  |%
  ++  noun  action:blog
  ++  json
    =,  dejs:format
    %-  of
    :~  [%publish (ot ~[path+pa html+so md+so theme+so])]
        [%unpublish (ot ~[path+pa])]
        [%save-draft (ot ~[path+pa md+so])]
        [%delete-draft (ot ~[path+pa])]
        [%save-theme (ot ~[theme+so css+so])]
        [%delete-theme (ot ~[theme+so])]
        [%update-uri (ot ~[uri+so])]
    ==
  --
::
++  grow
  |%
  ++  noun  action
  --
::
++  grad  %noun
--
