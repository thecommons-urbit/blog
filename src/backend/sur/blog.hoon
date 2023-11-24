|%
::
::  %blog-action
+$  action
  $%  [%publish =path html=@t md=@t theme=@tas]
      [%unpublish =path]
      [%export css=?]
      [%save-draft =path md=@t]
      [%delete-draft =path]
      [%save-theme theme=@tas css=@t]
      [%delete-theme theme=@tas]
      [%update-uri uri=@t]
  ==
::  XX unused; remove
+$  sub  [%sub =ship]
--
