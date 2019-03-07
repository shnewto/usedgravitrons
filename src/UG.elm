module UG exposing (..)

import Html exposing (Html, a, br, div, img, p, text)
import Html.Attributes exposing (class, href, id, src)

main : Html msg
main =
    view

view : Html msg
view =
    p []
        [ a [ href "issues/01.pdf" ]
            [ img [ src "img/01.png" ] [] ]
        , a [ href "issues/02.pdf" ]
            [ img [ src "img/02.png" ] [] ]
        , a [ href "issues/03.pdf" ]
            [ img [ src "img/03.png" ] [] ]
        , br [] []
        , a [ href "issues/04.pdf" ]
            [ img [ src "img/04.png" ] [] ]
        , a [ href "issues/05.pdf" ]
            [ img [ src "img/05.png" ] [] ]
        , a [ href "issues/06.pdf" ]
            [ img [ src "img/06.png" ] [] ]
        , br [] []
        , a [ href "issues/07.pdf" ]
            [ img [ src "img/07.png" ] [] ]
        , a [ href "issues/08.pdf" ]
            [ img [ src "img/08.png" ] [] ]
        , a [ href "issues/09.pdf" ]
            [ img [ src "img/09.png" ] [] ]
        , br [] []
        , a [ href "issues/10.pdf" ]
            [ img [ src "img/10.png" ] [] ]
        , a [ href "issues/11.pdf" ]
            [ img [ src "img/11.png" ] [] ]
        , a [ href "issues/12.pdf" ]
            [ img [ src "img/12.png" ] [] ]
        , br [] []
        , a [ href "issues/13.pdf" ]
            [ img [ src "img/13.png" ] [] ]
        , a [ href "issues/14.pdf" ]
            [ img [ src "img/14.png" ] [] ]
        , a [ href "issues/15.pdf" ]
            [ img [ src "img/15.png" ] [] ]
        , br [] []
        , a [ href "issues/16.pdf" ]
            [ img [ src "img/16.png" ] [] ]
        , a [ href "issues/17.pdf" ]
            [ img [ src "img/17.png" ] [] ]
        , a [ href "issues/18.pdf" ]
            [ img [ src "img/18.png" ] [] ]
        , br [] []
        , a [ href "issues/19.pdf" ]
            [ img [ src "img/19.png" ] [] ]
        ]

