import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  Button,
  Card,
  Container,
  Modal,
  Spinner,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { ethers } from "ethers";
import Layout from "../components/Layout";
import styles from "../styles/Common.module.scss";

declare let window: any;

const ApeCoin: NextPage = () => {
  const assetApi = "https://api.opensea.io/api/v1/assets";
  const listingApi =
    "https://api.opensea.io/api/v1/asset/{asset_contract_address}/{token_id}/listings";
  const osUrl = "https://opensea.io/assets/";
  const lrUrl = "https://looksrare.org/collections/";
  const address = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-mainnet.alchemyapi.io/v2/TqeAXaheP1_z1QOWUvOvVjcQl4KvxP0i"
  );
  const abi = ["function alphaClaimed(uint256) public view returns (bool)"];
  const contract = new ethers.Contract(
    "0x025c6da5bd0e6a5dd1350fda9e3b6a614b205a1f",
    abi,
    provider
  );
  const [timer, setTimer] = useState(null);
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState(10000);
  const pageSize = 30;
  const unclaimed = [
    1, 11, 17, 22, 25, 28, 29, 44, 48, 55, 56, 58, 60, 64, 66, 70, 81, 82, 83,
    87, 90, 92, 94, 96, 104, 113, 114, 116, 127, 133, 139, 146, 156, 163, 168,
    173, 185, 193, 217, 218, 232, 236, 238, 242, 250, 252, 265, 270, 273, 275,
    278, 284, 287, 290, 299, 303, 304, 306, 307, 308, 311, 318, 335, 336, 342,
    347, 348, 349, 355, 373, 391, 392, 402, 420, 422, 423, 424, 425, 427, 435,
    440, 441, 445, 448, 452, 453, 454, 467, 472, 480, 486, 491, 503, 507, 512,
    520, 521, 522, 526, 528, 529, 538, 542, 547, 568, 569, 587, 590, 593, 599,
    605, 611, 612, 615, 618, 622, 631, 632, 638, 644, 646, 647, 658, 661, 663,
    669, 673, 674, 675, 677, 678, 679, 680, 681, 683, 697, 698, 699, 700, 705,
    710, 711, 718, 723, 726, 727, 729, 736, 742, 754, 778, 786, 790, 791, 792,
    795, 805, 806, 808, 823, 826, 827, 829, 831, 834, 835, 837, 844, 889, 919,
    943, 944, 954, 957, 960, 961, 968, 996, 1004, 1006, 1010, 1016, 1017, 1018,
    1019, 1021, 1029, 1030, 1031, 1032, 1034, 1035, 1036, 1051, 1061, 1067,
    1068, 1075, 1081, 1082, 1086, 1088, 1102, 1108, 1121, 1126, 1127, 1128,
    1136, 1142, 1146, 1147, 1151, 1161, 1165, 1202, 1208, 1213, 1224, 1226,
    1228, 1230, 1233, 1243, 1247, 1250, 1251, 1252, 1255, 1258, 1261, 1262,
    1263, 1265, 1285, 1289, 1294, 1299, 1313, 1315, 1318, 1325, 1326, 1332,
    1333, 1335, 1339, 1340, 1343, 1352, 1356, 1362, 1365, 1378, 1380, 1392,
    1399, 1401, 1402, 1404, 1406, 1415, 1416, 1420, 1422, 1425, 1432, 1433,
    1440, 1443, 1444, 1452, 1455, 1456, 1461, 1468, 1469, 1470, 1473, 1479,
    1482, 1485, 1491, 1492, 1494, 1497, 1499, 1503, 1507, 1518, 1521, 1535,
    1538, 1541, 1542, 1549, 1554, 1557, 1564, 1566, 1568, 1569, 1572, 1574,
    1577, 1580, 1583, 1589, 1591, 1593, 1597, 1601, 1613, 1614, 1616, 1621,
    1627, 1638, 1639, 1644, 1657, 1661, 1662, 1678, 1685, 1689, 1690, 1691,
    1696, 1700, 1704, 1720, 1724, 1725, 1727, 1734, 1738, 1739, 1742, 1743,
    1748, 1751, 1755, 1756, 1759, 1760, 1768, 1773, 1787, 1788, 1789, 1797,
    1798, 1800, 1805, 1807, 1812, 1814, 1837, 1845, 1851, 1872, 1876, 1877,
    1880, 1884, 1886, 1887, 1888, 1891, 1897, 1901, 1902, 1903, 1909, 1913,
    1914, 1917, 1920, 1924, 1931, 1932, 1935, 1938, 1940, 1942, 1943, 1945,
    1947, 1964, 1976, 1979, 1982, 1986, 1994, 2002, 2006, 2011, 2014, 2018,
    2023, 2025, 2026, 2029, 2038, 2045, 2047, 2051, 2053, 2060, 2066, 2068,
    2074, 2075, 2076, 2077, 2080, 2085, 2087, 2089, 2090, 2094, 2101, 2104,
    2105, 2109, 2115, 2116, 2119, 2127, 2131, 2133, 2134, 2136, 2140, 2154,
    2161, 2163, 2164, 2165, 2169, 2170, 2173, 2177, 2178, 2179, 2180, 2185,
    2188, 2192, 2195, 2198, 2202, 2212, 2213, 2216, 2220, 2225, 2246, 2247,
    2248, 2257, 2263, 2264, 2277, 2283, 2284, 2285, 2293, 2304, 2307, 2308,
    2309, 2314, 2322, 2326, 2330, 2339, 2342, 2343, 2348, 2355, 2372, 2379,
    2388, 2389, 2396, 2398, 2406, 2407, 2412, 2414, 2423, 2425, 2428, 2429,
    2433, 2440, 2441, 2442, 2445, 2446, 2452, 2459, 2464, 2469, 2471, 2473,
    2480, 2484, 2486, 2497, 2504, 2505, 2524, 2525, 2531, 2534, 2536, 2539,
    2545, 2546, 2558, 2559, 2562, 2563, 2573, 2576, 2578, 2586, 2589, 2591,
    2601, 2608, 2615, 2618, 2620, 2621, 2628, 2640, 2642, 2649, 2650, 2660,
    2670, 2673, 2674, 2681, 2683, 2689, 2690, 2695, 2696, 2697, 2698, 2700,
    2701, 2702, 2703, 2705, 2706, 2707, 2708, 2709, 2711, 2712, 2713, 2714,
    2716, 2722, 2732, 2746, 2748, 2756, 2759, 2766, 2772, 2773, 2775, 2777,
    2778, 2786, 2789, 2792, 2793, 2794, 2798, 2806, 2808, 2811, 2816, 2821,
    2829, 2834, 2842, 2845, 2848, 2854, 2855, 2856, 2861, 2862, 2864, 2873,
    2877, 2886, 2887, 2889, 2913, 2931, 2938, 2961, 2964, 2965, 2967, 2971,
    2972, 2976, 2977, 2982, 2985, 2991, 2993, 2995, 2997, 2999, 3001, 3007,
    3025, 3031, 3043, 3044, 3047, 3055, 3057, 3070, 3079, 3086, 3087, 3089,
    3093, 3096, 3108, 3109, 3114, 3115, 3122, 3127, 3131, 3134, 3141, 3153,
    3161, 3171, 3174, 3188, 3190, 3191, 3194, 3197, 3199, 3200, 3201, 3204,
    3212, 3222, 3228, 3229, 3232, 3234, 3235, 3248, 3250, 3261, 3268, 3269,
    3273, 3279, 3281, 3282, 3283, 3298, 3304, 3313, 3319, 3322, 3324, 3326,
    3328, 3329, 3333, 3342, 3348, 3351, 3367, 3369, 3370, 3375, 3392, 3394,
    3396, 3409, 3413, 3419, 3425, 3427, 3436, 3438, 3442, 3443, 3444, 3456,
    3459, 3461, 3462, 3463, 3465, 3469, 3470, 3478, 3482, 3483, 3488, 3491,
    3505, 3510, 3513, 3515, 3522, 3529, 3543, 3558, 3565, 3568, 3581, 3589,
    3591, 3592, 3604, 3608, 3610, 3613, 3620, 3625, 3632, 3635, 3646, 3648,
    3658, 3663, 3672, 3675, 3694, 3697, 3704, 3724, 3734, 3738, 3742, 3750,
    3761, 3765, 3766, 3777, 3778, 3793, 3803, 3805, 3810, 3822, 3830, 3836,
    3838, 3841, 3844, 3845, 3852, 3856, 3859, 3861, 3874, 3878, 3880, 3883,
    3884, 3888, 3889, 3900, 3902, 3903, 3907, 3910, 3913, 3916, 3917, 3918,
    3919, 3921, 3928, 3931, 3932, 3937, 3943, 3944, 3953, 3956, 3958, 3961,
    3970, 3979, 3981, 3982, 3984, 3990, 3992, 3994, 4002, 4005, 4009, 4013,
    4015, 4020, 4021, 4028, 4032, 4040, 4045, 4051, 4054, 4055, 4058, 4062,
    4070, 4071, 4086, 4087, 4090, 4093, 4097, 4098, 4099, 4105, 4114, 4121,
    4123, 4136, 4146, 4154, 4159, 4180, 4191, 4197, 4203, 4206, 4207, 4209,
    4211, 4212, 4213, 4215, 4219, 4234, 4239, 4240, 4241, 4245, 4247, 4251,
    4258, 4274, 4286, 4287, 4293, 4303, 4307, 4309, 4320, 4324, 4329, 4333,
    4337, 4347, 4349, 4350, 4354, 4359, 4361, 4364, 4365, 4369, 4385, 4387,
    4390, 4393, 4394, 4395, 4397, 4404, 4406, 4408, 4418, 4420, 4429, 4430,
    4436, 4438, 4449, 4453, 4457, 4463, 4469, 4474, 4490, 4495, 4499, 4500,
    4502, 4507, 4511, 4514, 4524, 4525, 4528, 4531, 4533, 4536, 4544, 4548,
    4553, 4554, 4559, 4561, 4567, 4569, 4571, 4576, 4589, 4604, 4608, 4640,
    4641, 4642, 4646, 4650, 4651, 4656, 4658, 4659, 4660, 4666, 4669, 4672,
    4674, 4680, 4684, 4691, 4694, 4700, 4705, 4712, 4714, 4715, 4729, 4731,
    4733, 4734, 4748, 4758, 4759, 4761, 4762, 4765, 4777, 4783, 4789, 4790,
    4821, 4825, 4827, 4839, 4854, 4859, 4866, 4867, 4874, 4877, 4878, 4881,
    4885, 4887, 4891, 4904, 4912, 4933, 4936, 4945, 4952, 4955, 4957, 4964,
    4969, 4971, 4980, 4984, 4987, 4988, 4989, 5003, 5004, 5033, 5035, 5039,
    5044, 5045, 5047, 5055, 5057, 5059, 5061, 5062, 5072, 5074, 5075, 5082,
    5083, 5086, 5087, 5090, 5095, 5103, 5109, 5116, 5118, 5121, 5126, 5135,
    5143, 5149, 5163, 5168, 5175, 5176, 5186, 5187, 5189, 5196, 5215, 5223,
    5229, 5233, 5240, 5241, 5242, 5243, 5251, 5264, 5269, 5275, 5278, 5286,
    5287, 5289, 5297, 5311, 5315, 5316, 5322, 5325, 5331, 5333, 5335, 5340,
    5350, 5355, 5356, 5362, 5367, 5370, 5371, 5376, 5377, 5379, 5384, 5387,
    5388, 5389, 5395, 5398, 5405, 5419, 5423, 5425, 5426, 5428, 5430, 5440,
    5444, 5449, 5457, 5461, 5465, 5468, 5476, 5494, 5495, 5499, 5500, 5512,
    5523, 5530, 5541, 5542, 5548, 5549, 5552, 5557, 5558, 5564, 5566, 5579,
    5580, 5583, 5590, 5596, 5607, 5608, 5614, 5616, 5618, 5619, 5620, 5623,
    5625, 5630, 5675, 5677, 5678, 5679, 5680, 5685, 5693, 5697, 5703, 5708,
    5721, 5725, 5726, 5728, 5729, 5732, 5736, 5738, 5745, 5746, 5760, 5763,
    5765, 5776, 5783, 5788, 5789, 5791, 5797, 5799, 5805, 5806, 5808, 5814,
    5820, 5829, 5835, 5838, 5843, 5847, 5860, 5866, 5869, 5873, 5881, 5893,
    5903, 5905, 5909, 5925, 5931, 5938, 5947, 5948, 5956, 5960, 5965, 5967,
    5969, 5970, 5975, 5980, 5990, 5995, 6012, 6015, 6017, 6018, 6021, 6028,
    6032, 6035, 6037, 6041, 6043, 6046, 6049, 6052, 6055, 6059, 6061, 6066,
    6070, 6072, 6073, 6075, 6076, 6084, 6095, 6110, 6111, 6115, 6118, 6119,
    6120, 6124, 6127, 6129, 6130, 6141, 6143, 6144, 6149, 6151, 6170, 6181,
    6189, 6192, 6194, 6202, 6211, 6212, 6215, 6217, 6219, 6223, 6233, 6250,
    6253, 6257, 6261, 6262, 6265, 6266, 6275, 6287, 6291, 6295, 6299, 6300,
    6302, 6321, 6322, 6323, 6324, 6331, 6350, 6351, 6359, 6360, 6363, 6364,
    6370, 6373, 6375, 6376, 6378, 6382, 6384, 6390, 6413, 6414, 6420, 6421,
    6425, 6430, 6434, 6435, 6440, 6441, 6444, 6445, 6450, 6480, 6486, 6488,
    6489, 6494, 6495, 6502, 6505, 6515, 6525, 6528, 6532, 6546, 6547, 6549,
    6550, 6551, 6552, 6559, 6560, 6562, 6563, 6566, 6568, 6569, 6570, 6575,
    6586, 6594, 6600, 6606, 6607, 6608, 6617, 6619, 6627, 6631, 6633, 6635,
    6639, 6644, 6652, 6655, 6660, 6662, 6663, 6679, 6690, 6691, 6694, 6696,
    6697, 6698, 6700, 6701, 6702, 6709, 6710, 6725, 6727, 6740, 6744, 6746,
    6747, 6751, 6753, 6755, 6765, 6766, 6767, 6768, 6770, 6774, 6775, 6789,
    6793, 6794, 6802, 6803, 6804, 6805, 6806, 6808, 6809, 6812, 6814, 6816,
    6820, 6827, 6829, 6835, 6837, 6845, 6846, 6849, 6850, 6852, 6861, 6863,
    6868, 6869, 6877, 6883, 6884, 6896, 6897, 6902, 6908, 6925, 6926, 6942,
    6952, 6954, 6955, 6974, 6975, 6976, 6978, 6982, 6985, 6986, 6995, 6999,
    7009, 7018, 7020, 7024, 7025, 7028, 7031, 7036, 7037, 7040, 7045, 7052,
    7053, 7060, 7086, 7089, 7092, 7098, 7109, 7116, 7122, 7127, 7128, 7134,
    7136, 7138, 7142, 7143, 7144, 7146, 7151, 7154, 7158, 7171, 7172, 7173,
    7180, 7181, 7189, 7193, 7194, 7210, 7212, 7225, 7235, 7238, 7261, 7265,
    7276, 7280, 7281, 7282, 7285, 7287, 7289, 7310, 7313, 7315, 7320, 7333,
    7335, 7342, 7343, 7344, 7346, 7347, 7354, 7364, 7365, 7366, 7368, 7369,
    7372, 7374, 7380, 7386, 7388, 7395, 7401, 7402, 7407, 7408, 7413, 7421,
    7427, 7428, 7429, 7432, 7434, 7437, 7440, 7441, 7445, 7447, 7449, 7453,
    7455, 7458, 7461, 7462, 7466, 7470, 7473, 7492, 7502, 7517, 7518, 7519,
    7536, 7537, 7545, 7551, 7562, 7563, 7569, 7570, 7580, 7597, 7600, 7602,
    7603, 7605, 7608, 7616, 7629, 7632, 7638, 7656, 7657, 7664, 7674, 7675,
    7678, 7679, 7681, 7683, 7686, 7687, 7688, 7694, 7697, 7702, 7706, 7707,
    7708, 7709, 7710, 7711, 7712, 7714, 7715, 7717, 7720, 7725, 7727, 7732,
    7738, 7746, 7748, 7749, 7750, 7752, 7755, 7759, 7760, 7768, 7779, 7792,
    7793, 7803, 7806, 7807, 7813, 7819, 7824, 7840, 7841, 7870, 7874, 7884,
    7890, 7891, 7896, 7899, 7912, 7921, 7933, 7937, 7944, 7946, 7947, 7952,
    7957, 7959, 7976, 7977, 7983, 7986, 7989, 7990, 7994, 7995, 8007, 8009,
    8010, 8012, 8013, 8014, 8018, 8019, 8020, 8026, 8045, 8050, 8056, 8060,
    8066, 8067, 8072, 8074, 8075, 8077, 8081, 8085, 8086, 8087, 8088, 8090,
    8095, 8104, 8106, 8109, 8112, 8115, 8116, 8119, 8124, 8125, 8126, 8134,
    8136, 8140, 8154, 8163, 8164, 8168, 8170, 8171, 8181, 8207, 8220, 8227,
    8229, 8230, 8233, 8238, 8244, 8246, 8251, 8257, 8259, 8268, 8288, 8289,
    8290, 8291, 8292, 8299, 8304, 8310, 8313, 8320, 8324, 8329, 8338, 8342,
    8343, 8345, 8351, 8353, 8358, 8361, 8362, 8364, 8372, 8375, 8377, 8379,
    8380, 8384, 8387, 8390, 8392, 8395, 8396, 8404, 8407, 8408, 8409, 8410,
    8415, 8418, 8422, 8426, 8430, 8435, 8437, 8448, 8451, 8452, 8453, 8454,
    8455, 8457, 8458, 8459, 8466, 8472, 8473, 8480, 8481, 8484, 8485, 8489,
    8494, 8497, 8508, 8510, 8511, 8513, 8515, 8522, 8529, 8539, 8541, 8542,
    8545, 8549, 8551, 8559, 8561, 8565, 8571, 8572, 8579, 8582, 8593, 8598,
    8608, 8612, 8613, 8617, 8619, 8621, 8622, 8629, 8631, 8634, 8638, 8640,
    8641, 8643, 8647, 8651, 8655, 8656, 8658, 8661, 8664, 8665, 8667, 8672,
    8674, 8677, 8678, 8679, 8684, 8695, 8697, 8703, 8704, 8707, 8708, 8710,
    8712, 8714, 8724, 8725, 8732, 8735, 8737, 8744, 8749, 8758, 8759, 8760,
    8764, 8766, 8771, 8774, 8778, 8779, 8780, 8781, 8782, 8783, 8784, 8789,
    8791, 8798, 8807, 8817, 8829, 8832, 8837, 8840, 8845, 8846, 8849, 8859,
    8860, 8862, 8876, 8877, 8886, 8891, 8907, 8909, 8914, 8920, 8923, 8924,
    8935, 8942, 8950, 8951, 8955, 8957, 8958, 8972, 8976, 8977, 8980, 8981,
    8983, 8984, 8985, 8986, 8991, 8995, 8998, 9004, 9009, 9011, 9013, 9014,
    9016, 9017, 9024, 9028, 9032, 9038, 9039, 9044, 9047, 9052, 9055, 9064,
    9065, 9074, 9080, 9081, 9082, 9085, 9095, 9114, 9116, 9123, 9132, 9133,
    9139, 9142, 9144, 9160, 9164, 9165, 9168, 9174, 9176, 9182, 9185, 9186,
    9202, 9206, 9207, 9209, 9212, 9221, 9222, 9224, 9225, 9226, 9227, 9228,
    9229, 9231, 9235, 9244, 9245, 9247, 9249, 9254, 9258, 9259, 9263, 9267,
    9271, 9272, 9275, 9276, 9279, 9298, 9308, 9316, 9322, 9329, 9332, 9356,
    9359, 9366, 9370, 9372, 9375, 9378, 9383, 9387, 9389, 9392, 9418, 9422,
    9423, 9424, 9427, 9431, 9435, 9436, 9442, 9455, 9460, 9461, 9476, 9506,
    9507, 9513, 9515, 9516, 9517, 9519, 9520, 9522, 9523, 9525, 9528, 9529,
    9530, 9531, 9536, 9539, 9543, 9546, 9550, 9554, 9557, 9558, 9577, 9578,
    9582, 9588, 9593, 9599, 9601, 9615, 9617, 9619, 9620, 9622, 9633, 9640,
    9641, 9645, 9653, 9654, 9655, 9658, 9663, 9666, 9673, 9674, 9675, 9679,
    9684, 9688, 9692, 9698, 9699, 9700, 9705, 9708, 9710, 9712, 9723, 9724,
    9732, 9734, 9736, 9742, 9753, 9763, 9774, 9777, 9787, 9796, 9798, 9801,
    9804, 9807, 9809, 9814, 9820, 9832, 9835, 9839, 9840, 9842, 9844, 9847,
    9850, 9855, 9856, 9862, 9871, 9876, 9878, 9881, 9882, 9883, 9890, 9891,
    9897, 9899, 9902, 9904, 9906, 9907, 9917, 9918, 9919, 9922, 9936, 9944,
    9951, 9953, 9957, 9959, 9962, 9971, 9975, 9977, 9981, 9983, 9991,
  ];
  let lastPage = Math.floor(unclaimed.length / pageSize);

  const paginate = (array, page_size, page_number) => {
    return array.slice(
      page_number * page_size,
      page_number * page_size + page_size
    );
  };

  const nextPage = () => {
    setPage(page + 1);
    setTempPage(page + 1);
  };

  const previousPage = () => {
    setPage(page - 1);
    setTempPage(page - 1);
  };

  const [tempPage, setTempPage] = useState(0);

  const jumpPage = (e) => {
    e.preventDefault();
    let p = parseInt(e.target.value) || 0;
    setTempPage(p);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        if (p >= 0 && p <= lastPage) {
          setPage(p);
        } else {
          return;
        }
      }, 750)
    );
  };

  const checkClaimed = async (id, isOpensea) => {
    let claimed = await contract.alphaClaimed(parseInt(id));
    if (!claimed) {
      openUrl(id, isOpensea);
    } else {
      setSelectedTokenId(id);
      setPrompt(true);
    }
  };

  const openUrl = (id, isOpensea) => {
    window.open((isOpensea ? osUrl : lrUrl) + address + "/" + id, "_blank");
    if (prompt) {
      setPrompt(false);
    }
  };

  useEffect(() => {
    async function os() {
      setLoading(true);
      let tokenIds = paginate(unclaimed, pageSize, page);
      if (tokenIds.length <= 0) {
        setLoading(false);
        return;
      }
      let requestUrl =
        assetApi +
        "?limit=50&include_orders=true&asset_contract_address=" +
        address +
        "&token_ids=" +
        tokenIds.join("&token_ids=");
      let res = await fetch(requestUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json());
      setAssets(res.assets);
      setLoading(false);
    }
    os();
  }, [page]);

  return (
    <Layout>
      <h1>ApeCoin unclaimed`&apos;s BAYC (Snapshot at 3/18/2022 2PM UTC)</h1>
      <div className={styles.pageButtons}>
        {page != 0 ? (
          <Button variant="primary" size="lg" onClick={previousPage}>
            Previous
          </Button>
        ) : (
          <></>
        )}
        <span style={{ margin: "0 16px" }}>
          <InputGroup>
            <FormControl
              value={tempPage}
              style={{ width: "56px" }}
              onChange={jumpPage}
            />
            <InputGroup.Text>/{lastPage}</InputGroup.Text>
          </InputGroup>
        </span>
        {page != lastPage ? (
          <Button variant="primary" size="lg" onClick={nextPage}>
            Next
          </Button>
        ) : (
          <></>
        )}
      </div>
      <Container fluid className={styles.cardGrid}>
        {assets.map((asset) => (
          <Card className={styles.baycCard} key={asset.id}>
            <Card.Img variant="top" src={asset.image_preview_url} />
            <Card.Body>
              <Card.Title className={styles.cardTitle}>
                <span>#{asset.token_id}</span>
                {asset.sell_orders != null ? (
                  <span style={{ color: "#0fa" }}>
                    {parseFloat(
                      ethers.utils.formatEther(
                        ethers.BigNumber.from(asset.sell_orders[0].base_price)
                      )
                    ).toFixed(2)}
                    ETH
                  </span>
                ) : (
                  <span style={{ color: "grey" }}>Delisted</span>
                )}
              </Card.Title>
              <Card.Footer
                style={{ justifyContent: "space-around", display: "flex" }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => checkClaimed(asset.token_id, true)}
                >
                  <img alt="OpenSea" src="/opensea.png" width="32" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => checkClaimed(asset.token_id, false)}
                >
                  <img alt="looksrare" src="/looksrare.png" width="32" />
                </Button>
              </Card.Footer>
            </Card.Body>
          </Card>
        ))}
      </Container>
      <div className={styles.pageButtons}>
        {page != 0 ? (
          <Button variant="primary" size="lg" onClick={previousPage}>
            Previous
          </Button>
        ) : (
          <></>
        )}
        <span style={{ margin: "0 16px" }}>
          <InputGroup>
            <FormControl
              value={tempPage}
              style={{ width: "56px" }}
              onChange={jumpPage}
            />
            <InputGroup.Text>/{lastPage}</InputGroup.Text>
          </InputGroup>
        </span>
        {page != lastPage ? (
          <Button variant="primary" size="lg" onClick={nextPage}>
            Next
          </Button>
        ) : (
          <></>
        )}
      </div>

      <Modal
        show={loading}
        backdrop="static"
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={styles.loadingModalA}
      >
        <Modal.Body>
          <Spinner animation="grow" />
          <p>Fetching</p>
        </Modal.Body>
      </Modal>

      <Modal
        show={prompt}
        onHide={() => setPrompt(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={styles.loadingModalA}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <p>Sorry, BAYC #{selectedTokenId} already used to claim ApeCoin.</p>
          <div>
            <Button
              variant="secondary"
              onClick={() => openUrl(selectedTokenId, true)}
            >
              <img alt="OpenSea" src="/opensea.png" width="32" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => openUrl(selectedTokenId, false)}
            >
              <img alt="looksrare" src="/looksrare.png" width="32" />
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default ApeCoin;
