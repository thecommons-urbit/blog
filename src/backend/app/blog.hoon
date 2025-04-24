/-  blog, blog-paths
::  XX sss; remove on transition to %4
/+  blog-lib=blog, dbug, default-agent, *sss
::
%-  agent:dbug
^-  agent:gall
=>  |%
    +$  versioned-state
      $%  state-1
          state-2
          state-3
      ==
    +$  state-1
      $:  %1
          files=(map path (pair html=@t md=@t))        ::  blog posts
          drafts=(map path md=@t)                      ::  saved drafts
      ==
    +$  state-2
      $:  %2
          files=(map path [html=@t md=@t theme=@tas])  ::  blog posts
          drafts=(map path md=@t)                      ::  saved drafts
          themes=(map @tas css=@t)                     ::  css themes
      ==
    +$  state-3
      $:  %3
          files=(map path [html=@t md=@t theme=@tas])  ::  blog posts
          drafts=(map path md=@t)                      ::  saved drafts
          themes=(map @tas css=@t)                     ::  css themes
          pub-paths=_(mk-pubs blog-paths ,[%paths ~])  ::  XX sss; remove on transition to state-4
      ==
    ::  XX move into +* below
    +$  card  $+(card card:agent:gall)
    --
=|  state-3
=*  state  -
::
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
    ::  XX sss; remove on transition to state-4
    du-paths
    =/  du
      (du blog-paths ,[%paths ~])
    (du pub-paths bowl -:!>(*result:du))
::
++  on-init
  ^-  (quip card _this)
  :-  ~
  %=  this
    ::  save default css theme
    themes  (~(gas by themes) ~[[%default default-theme:blog-lib]])
  ==
::
++  on-save
  !>(state)
::
++  on-load
  |=  =vase
  ^-  (quip card _this)
  =+  !<(old=versioned-state vase)
  ?-    -.old
      %1
    ::
    ::  update paths
    :-  %-  zing
        %+  turn  ~(tap by files.old)
        |=  [=path *]
        :~  ::  disconnect old http endpoint for each post
            [%pass /bind %arvo %e %disconnect `path]
            ::  expose a new http endpoint for each post
            [%pass /bind %arvo %e %connect `path dap.bowl]
        ==
    ::
    ::  update state
    %=    this
        state
      :*  %3
          ::  return posts with no theme
          (~(urn by files.old) |=([=path html=@t md=@t] [html md %none]))
          drafts.old
          ::  return default theme
          (~(gas by *(map @tas @t)) [%default default-theme:blog-lib]~)
          pub-paths
      ==
    ==
  ::
      %2
    ::  update state
    =.  state
      [%3 files.old drafts.old themes.old pub-paths]
    ::  update pub-paths
    =^    cards
        pub-paths
      (give:du-paths [%paths ~] [%init ~(key by files)])
    :_  this
    ::
    ::  update posts
    %+  welp
      cards
    %-  zing
    %+  turn
      ~(tap by files.old)
    |=  [=path html=@t md=@t theme=@tas]
    :~  ::
        ::  disconnect old http endpoint for this post
        [%pass /bind %arvo %e %disconnect `path]
        ::
        ::  add html page for this post to
        ::  eyre cache with added mime type
        :*  %pass  /bind  %arvo  %e
            %set-response  (spat path)
            ~  %.n  %payload
            [200 ['Content-Type' 'text/html; charset=utf-8']~]
            ::  append <style> tag to html page
            =/  tem=@t  (~(gut by themes.old) theme '')
            `(as-octs:mimes:^html (cat 3 html (add-style:blog-lib tem)))
        ==
        ::
        ::  add <path>.md page for this post to
        ::  eyre cache with added mime type
        :*  %pass  /bind  %arvo  %e
            %set-response  (cat 3 (spat path) '.md')
            ~  %.n  %payload
            [200 ['Content-Type' 'text/plain; charset=utf-8']~]
            `(as-octs:mimes:^html md)
    ==  ==
  ::
      %3
    :_  this(state old)
    ::
    ::  update posts
    %-  zing  %+  turn  ~(tap by files.old)
    |=  [=path html=@t md=@t theme=@tas]
    :~  ::
        ::  disconnect old http endpoint for this post
        [%pass /bind %arvo %e %disconnect `path]
        ::
        ::  add html page for this post to
        ::  eyre cache with added mime type
        :*  %pass  /bind  %arvo  %e
            %set-response  (spat path)
            ~  %.n  %payload
            [200 ['Content-Type' 'text/html; charset=utf-8']~]
            ::  append <style> tag to html page
            =/  tem=@t  (~(gut by themes.old) theme '')
            `(as-octs:mimes:^html (cat 3 html (add-style:blog-lib tem)))
        ==
        ::
        ::  add <path>.md file for this post to
        ::  eyre cache with added mime type
        :*  %pass  /bind  %arvo  %e
            %set-response  (cat 3 (spat path) '.md')
            ~  %.n  %payload
            [200 ['Content-Type' 'text/plain; charset=utf-8']~]
            `(as-octs:mimes:^html md)
        ==
      ::  XX remove sss in transition to state-4
    ==
  ==
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+    mark
      ~|("unexpected poke to {<dap.bowl>} with mark {<mark>}" !!)
    ::
      %blog-action
    =+  !<(act=action:blog vase)
    ?>  =(src.bowl our.bowl)
    ::  ~&  >>  "attempting {<mark>} poke: {<act>}"
    ?-    -.act
        %publish
      ::  XX sss; remove on transition to %4
      =^    cards
          pub-paths
        (give:du-paths [%paths ~] [%post path.act])
      ::  add post to files
      :_  this(files (~(put by files) [path html md theme]:act))
      %+  welp
        cards
      :~  ::
          ::  add <path>.md page for this post to eyre cache
          :*  %pass  /bind  %arvo  %e
              %set-response  (cat 3 (spat path.act) '.md')
              ~  %.n  %payload
              [200 ['Content-Type' 'text/plain; charset=utf-8']~]
              `(as-octs:mimes:html md.act)
          ==
          ::
          ::  add html file for this post to eyre cache
          :*  %pass  /bind  %arvo  %e
              %set-response  (spat path.act)
              ~  %.n  %payload
              [200 ['Content-Type' 'text/html; charset=utf-8']~]
              ::  append <style> tag to html page
              =/  tem=@t  (~(gut by themes) theme.act '')
              `(as-octs:mimes:html (cat 3 html.act (add-style:blog-lib tem)))
      ==  ==
    ::
        %unpublish
      ::  XX sss; remove on transition to %4
      ::  remove post from pub-paths
      =^    cards
          pub-paths
        (give:du-paths [%paths ~] [%depost path.act])
      ::  remove post from files
      :_  this(files (~(del by files) path.act))
      %+  welp
        cards
      :~  ::  remove eyre cache entries for this post
          [%pass /bind %arvo %e %set-response `@t`(cat 3 (spat path.act) '.md') ~]
          [%pass /bind %arvo %e %set-response (spat path.act) ~]
      ==
    ::
        %export
      ::
      =/  soba-html=soba:clay
        %-  zing
        %+  turn  ~(tap by files)
        |=  [=path html=@t md=@t theme=@tas]
        ^-  soba:clay
        =/  tem  (~(gut by themes) theme '')
        :~  :-  [%export %published %html (snoc path %html)]
            [%ins %html !>((cat 3 html (add-style:blog-lib tem)))]
        ::
            :-  [%export %published %md (snoc path %md)]
            [%ins %md !>([md ~])]
        ==
      ::
      =/  soba-md=soba:clay
        %+  turn  ~(tap by drafts)
        |=  [=path md=@t]
        ^-  (pair ^path miso:clay)
        [[%export %drafts (snoc path %md)] %ins %md !>([md ~])]
      ::
      =/  soba-css=soba:clay
        %+  turn  ~(tap by themes)
        |=  [theme=@tas css=@t]
        ^-  (pair path miso:clay)
        [[%export %themes theme %css ~] %ins %css !>(css)]
      ::
      :_  this
      :~  [%pass /info %arvo %c %info %blog %& soba-html]
          [%pass /info %arvo %c %info %blog %& soba-md]
          [%pass /info %arvo %c %info %blog %& soba-css]
      ==
    ::
      %save-draft
      `this(drafts (~(put by drafts) [path md]:act))
      %delete-draft
      `this(drafts (~(del by drafts) path.act))
      %save-theme
      `this(themes (~(put by themes) [theme css]:act))
      %delete-theme
      `this(themes (~(del by themes) theme.act))
    ::
        %update-uri
      ::  XX sss; remove on transition to %4
      =^  cards  pub-paths  (give:du-paths [%paths ~] [%uri uri.act])
      [cards this]
    ==  ::  end of %blog-action pokes
    ::
    ::  XX sss; remove on transition to %4
        %sss-to-pub
      =/  msg  !<(into:du-paths (fled vase))
      =^  cards  pub-paths  (apply:du-paths msg)
      [cards this]
  ==  ::  end of pokes
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ::  ~&  >>  "attempting scry on {<path>}"
  ?+  path  ~&("unexpected scry into {<dap.bowl>} on path {<path>}" ~)
    ::
    ::  get .md version of a post
    ::  XX handle null case
    ::  .^(cord %gx /=blog=/md/test/noun)
      [%x %md ^]
        %-  some
        %-  some
        :-  %blog
        ::  XX lark notation here is bad practice
        !>(+<:(~(got by files) t.t.path))
    ::
    ::  get .html version of a post
    ::  XX handle null case
    ::  .^(cord %gx /=blog=/html/test/noun)
      [%x %html ^]
        %-  some
        %-  some
        :-  %blog
        !>(-:(~(got by files) t.t.path))
    ::
    ::  get text of a draft post
    ::  XX handle null case
    ::  .^(cord %gx /=blog=/draft/new-draft/noun)
      [%x %draft ^]
        %-  some
        %-  some
        :-  %blog
        !>((~(got by drafts) t.t.path))
    ::
    ::  get theme by path
    ::  XX handle null case
    ::  .^(cord %gx /=blog=/theme/default/noun)
      [%x %theme @ ~]
        %-  some
        %-  some
        :-  %blog
        !>((~(got by themes) i.t.t.path))
    ::
    ::  get uri
    ::  XX handle null case
    ::  .^(cord %gx /=blog=/uri/noun)
      [%x %uri ~]
        %-  some
        %-  some
        :-  %blog
        ::  XX sss; remove on transition to %4
        !>(uri:rock:(~(got by read:du-paths) [%paths ~]))
    ::
    ::  get published posts
    ::  XX handle null case
    ::  .^(json %gx /=blog=/pages/noun)
      [%x %pages ~]
        =;  pages  ``json+!>([%a pages])
        (turn ~(tap by files) |=([=^path *] (path:enjs:format path)))
    ::
    ::  get drafts
    ::  XX handle null case
    ::  .^(json %gx /=blog=/drafts/noun)
      [%x %drafts ~]
        =;  names  ``json+!>([%a names])
        (turn ~(tap by drafts) |=([=^path *] (path:enjs:format path)))
    ::
    ::  get themes
    ::  XX handle null case
    ::  .^(json %gx /=blog=/themes/noun)
      [%x %themes ~]
        =;  themes  ``json+!>([%a themes])
        (turn ~(tap by themes) |=([t=@tas *] s+t))
    ::
    ::  get name of active theme for a post
    ::  XX handle null case
    ::  .^(json %gx /=blog=/active-theme/test/noun)
      [%x %active-theme ^]
        =;  theme  ``json+!>(s+theme)
        theme:(~(got by files) t.t.path)
    ::
    ::  ask if %pals and %rumors are both installed on our ship
    ::  .^(json %gx /=blog=/aaaah/noun)
    [%x %aaaah ~]
      %-  some
      %-  some
      :-  %json
      !>
      :-  %b
      ?&  .^(? %gu /(scot %p our.bowl)/pals/(scot %da now.bowl)/$)
          .^(? %gu /(scot %p our.bowl)/rumors/(scot %da now.bowl)/$)
      ==
    ::
    ::  get all URLs that are in use by other apps on our ship
    ::  .^(json %gx /=blog=/all-bindings/noun)
      [%x %all-bindings ~]
        =;  the-thing  ``json+!>(the-thing)
        %-  pairs:enjs:format
        %+  weld
          %+  turn  ~(tap by files)
          |=([=^path *] (spat path)^s+'app: %blog')
        %+  turn
          .^  (list [binding:eyre * action:eyre])  %e
              /(scot %p our.bowl)/bindings/(scot %da now.bowl)
          ==
        |=  [=binding:eyre * =action:eyre]
        ^-  [@t json]
        :-  (spat path.binding)
        ?-  -.action
          %gen             [%s (crip "desk: {<desk.generator.action>}")]
          %app             [%s (crip "app: {<app.action>}")]
          %authentication  [%s '%authentication']
          %logout          [%s '%logout']
          %channel         [%s '%channel']
          %scry            [%s '%scry']
          %name            [%s '%name']
          %four-oh-four    [%s '%four-oh-four']
          ::  minimum-viable eauth compatibilty
          %eauth           [%s '%eauth']
          ::  410k
          %host            [%s '%host']
          %boot            [%s '%boot']
          %ip              [%s '%ip']
          %sponsor         [%s '%sponsor']
        ==
  ==  ::  end of path branches
::
++  on-arvo   on-arvo:def
++  on-agent  on-agent:def
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
