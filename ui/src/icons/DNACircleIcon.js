import { BaseSvg } from 'icons';

export default ({ fill = 'currentColor', height = '12px', width = '12px', ...props }) =>
  BaseSvg({
    alt: 'DNA Icon',
    height,
    width,
    svg: `<svg width="${width}" height="${height}" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="forms/search/gene-open" transform="translate(-6.000000, -108.000000)" fill="${fill}"> <g id="dropdown" transform="translate(0.000000, 12.000000)"> <g id="item" transform="translate(1.000000, 88.000000)"> <g id="icons/variants" transform="translate(5.000000, 8.000000)"> <path d="M10,0 C15.5203091,0.00612347662 19.9938765,4.47969092 20,10 C20,15.5228475 15.5228475,20 10,20 C4.4771525,20 -6.76353751e-16,15.5228475 0,10 C6.76353751e-16,4.4771525 4.4771525,-3.38176876e-16 10,0 Z M10,19.2311111 C15.0956638,19.2249887 19.2249887,15.0956638 19.2311111,10 C19.2311111,4.90179811 15.0982019,0.768888889 10,0.768888889 C4.90179811,0.768888889 0.768888889,4.90179811 0.768888889,10 C0.768888889,15.0982019 4.90179811,19.2311111 10,19.2311111 Z M16.4444444,6.91555556 C16.5021687,6.97613814 16.5330541,7.05742013 16.5301271,7.14104889 C16.5272001,7.22467766 16.4907075,7.30360141 16.4288889,7.36 C15.6955556,8.04222222 14.72,8.22666667 13.88,8.22666667 C13.6728984,8.22619623 13.4659582,8.21507042 13.26,8.19333333 C13.1440831,8.18924437 13.0400658,8.12101132 12.9901453,8.01631469 C12.9402248,7.91161806 12.9526913,7.78784431 13.0224873,7.69520546 C13.0922833,7.6025666 13.2078181,7.55644673 13.3222222,7.57555556 C13.6746006,7.61229371 14.0298439,7.61229371 14.3822222,7.57555556 L13.0022222,6.19555556 C12.8794923,6.07282561 12.8794923,5.87384106 13.0022222,5.75111111 C13.1249522,5.62838117 13.3239367,5.62838117 13.4466667,5.75111111 L15.1111111,7.41777778 C15.4407804,7.31019011 15.7437852,7.13368978 16,6.9 C16.0602939,6.84169586 16.1417052,6.81041708 16.2255272,6.81335085 C16.3093491,6.81628462 16.3883743,6.85317868 16.4444444,6.91555556 Z M12.7133333,7.96444444 C12.7211284,7.96845767 12.7248338,7.97755466 12.7220613,7.98587228 C12.7192887,7.99418989 12.7108662,7.99924426 12.7022222,7.99777778 C12.7377778,8.10666667 13.4288889,10.3777778 11.8888889,11.9111111 L11.8755556,11.9111111 C11.1801494,12.5612617 10.2560204,12.9103061 9.30444444,12.8822222 C9.08514901,12.8829548 8.86607873,12.8681026 8.64888889,12.8377778 C8.53413235,12.828289 8.43400156,12.756192 8.38860873,12.6503686 C8.3432159,12.5445452 8.35998547,12.4223039 8.43219957,12.3326143 C8.50441368,12.2429247 8.62026101,12.2004565 8.73333333,12.2222222 C9.03841799,12.261897 9.34694368,12.2678589 9.65333333,12.24 L8.30222222,10.8888889 C8.17949229,10.7661589 8.1794923,10.5671744 8.30222224,10.4444445 C8.42495218,10.3217145 8.62393672,10.3217145 8.74666667,10.4444444 L10.3911111,12.0977778 C10.6863575,12.0019112 10.962964,11.8560915 11.2088889,11.6666667 L8.32,8.77777778 C7.33333333,10.0311111 7.84444444,11.7288889 7.87555556,11.8266667 C7.93333333,11.9977778 8.84888889,14.78 7.32444444,16.3977778 C7.26682075,16.459335 7.18653698,16.4946599 7.10222222,16.4955556 C7.01997225,16.4974526 6.94023357,16.4671519 6.88,16.4111111 C6.81848645,16.3544064 6.78240333,16.2753165 6.7798946,16.1916921 C6.77738586,16.1080676 6.80866297,16.0269569 6.86666667,15.9666667 C8.15111111,14.6022222 7.28222222,12.0466667 7.28222222,12.0222222 C7.24666667,11.9088889 6.56,9.64 8.09777778,8.11111111 C8.50351871,7.7105872 9.00556556,7.42129801 9.55555556,7.27111111 C9.58632292,7.25613184 9.61936553,7.24636925 9.65333333,7.24222222 C10.2092219,7.10923171 10.7851802,7.08209232 11.3511111,7.16222222 C11.4658677,7.17171096 11.5659984,7.24380799 11.6113913,7.34963139 C11.6567841,7.45545478 11.6400145,7.57769609 11.5678004,7.66738569 C11.4955863,7.75707528 11.379739,7.79954354 11.2666667,7.77777778 C10.9558995,7.7351892 10.6413245,7.72773482 10.3288889,7.75555556 L11.68,9.11111111 C11.7402916,9.1693198 11.7743437,9.24952806 11.7743437,9.33333333 C11.7743437,9.41713861 11.7402916,9.49734687 11.68,9.55555556 C11.6216919,9.61531888 11.5412573,9.64829706 11.4577778,9.64666667 C11.374446,9.64751679 11.2943062,9.61465949 11.2355556,9.55555556 L9.59111111,7.9 C9.29188405,7.99912798 9.01216509,8.14951453 8.76444444,8.34444444 L11.6533333,11.2333333 C12.6711111,9.97777778 12.1555556,8.26444444 12.1244444,8.16444444 C12.0666667,8 11.1488889,5.21111111 12.6844444,3.59333333 C12.8063792,3.49764529 12.9801503,3.50630811 13.0919637,3.61364894 C13.2037771,3.72098977 13.2195224,3.89426278 13.1288889,4.02 C11.8422222,5.38444444 12.7133333,7.94 12.7133333,7.96444444 Z M6.74222222,13.8533333 L6.73777778,13.8511111 C6.81717014,13.9305035 6.84817638,14.0462203 6.81911677,14.1546723 C6.79005715,14.2631243 6.70534651,14.3478349 6.59689454,14.3768945 C6.48844256,14.4059542 6.37272569,14.3749479 6.29333333,14.2955556 L4.66666667,12.6666667 C4.42067295,12.7756178 4.19518326,12.9259443 4,13.1111111 C3.9382738,13.1704965 3.85466012,13.2015847 3.76913078,13.1969501 C3.68360144,13.1923155 3.60383665,13.1523743 3.54888889,13.0866667 C3.49116465,13.0260841 3.46027924,12.9448021 3.46320624,12.8611733 C3.46613325,12.7775446 3.50262587,12.6986208 3.56444444,12.6422222 C3.87277507,12.3606817 4.2359094,12.1458272 4.63111111,12.0111111 C5.30664419,11.7922198 6.02192425,11.7239534 6.72666667,11.8111111 C6.84300214,11.814195 6.94788927,11.8819494 6.9985319,11.986729 C7.04917454,12.0915087 7.03710388,12.2157917 6.96724503,12.308868 C6.89738617,12.4019443 6.78142136,12.448249 6.66666667,12.4288889 C6.22995933,12.3832482 5.78914743,12.3952024 5.35555556,12.4644444 L6.74222222,13.8533333 Z" id="Combined-Shape"></path> </g> </g> </g> </g> </g> </svg>`,
    ...props,
  });
