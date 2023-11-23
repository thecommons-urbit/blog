::
::  XX remove this file in transition to %4
::
|%
++  name  %blog-paths
+$  rock  [uri=@t paths=(set path)]
+$  wave
  $%  [%init paths=(set path)]
      [%post =path]
      [%depost =path]
      [%uri uri=@t]
  ==
++  wash
  |=  [=rock =wave]
  ?-  -.wave
    %init    rock(paths paths.wave)
    %post    rock(paths (~(put in paths.rock) path.wave))
    %depost  rock(paths (~(del in paths.rock) path.wave))
    %uri     rock(uri uri.wave)
  ==
--
