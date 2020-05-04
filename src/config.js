const config = {
    "main": 
        {
            "element": "clchart",
            "containerMaxWidth": 680,
            "ratio": 0.9,
            "marginTop": 95,
            "marginRight": 50,
            "marginBottom": 60,
            "marginLeft": 140,
            "titleText": "There were fewer premises in the North East",
            "titleOffsetX": 20,
            "titleOffsetY": 40,
            "titleSize": 22,
            "subtitleText": "Number of premises by English region",
            "subtitleOffsetX": 20,
            "subtitleOffsetY": 28,
            "subtitleSize": 17,
            "paddingInner": 0.175,
            "paddingOuter": 0.175,
            "keyColumn": "region",
            "keySize": 11,
            "valueColumn": "premises",
            "valueMin": 0.0,
            "valueMax": 4.2,
            "valueTicks": 5,
            "valueSize": 11,
            "valueTitleText": "Millions",
            "valueTitleOffset": 45,
            "valueTitleSize": 12,
            "labelColumn": "premises_label",
            "labelSize": 11
        },
    "alts": [ 
        {
            "containerMaxWidth": 550,
            "marginLeft": 50,
            "keyColumn": "region_short",
            "keySize": 10,
            "valueSize": 10,
            "valueTitleSize": 10
        }
    ]
};

export { config };