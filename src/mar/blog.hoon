:: Realy all unix/mime stuff should look something like this but w/e
::
|_  txt=@t
::
++  grab
  |%
  ++  mime  |=((pair mite octs) (@t q.q))
  ++  noun  @t
  --
++  grow
  |%
  :: TODO you actually do want separate html and md marks
  ::   because md is /text/plain while html is text/html
  ++  mime  [/text/plain (as-octs:mimes:html txt)]
  ++  json  [%s txt]
  --
++  grad  %mime
--
