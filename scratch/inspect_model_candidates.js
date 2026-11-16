const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const candidates = [
  { id: 'gen_b1', path: 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/bundle_lifting_pack_blue_1794826800910.jpg' },
  { id: 'gen_b2', path: 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/bundle_heavy_lifter_pack_black_1794826836025.jpg' },
  { id: 'gen_b3', path: 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/bundle_pro_powerlifting_pack_1794826863583.jpg' },
  { id: 'gen_b6', path: 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/photo_6_red_squat_pack_1794826836557.jpg' },
  { id: 'gen_b11', path: 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/photo_11_gym_carry_pack_gray_1794826795975.jpg' },
  { id: 'gen_b12', path: 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/photo_12_speed_strength_pack_blue_1794826815793.jpg' },
  { id: 'gen_b13', path: 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/photo_13_speed_reflex_pro_pack_gray_1794826849333.jpg' },
  { id: 'hero_straps', path: 'nesports-pro-store/assets/images/hero-lifting-straps.png' },
  { id: 'hero_knee', path: 'nesports-pro-store/assets/images/hero-knee-wrap.png' },
  { id: 'hero_speed', path: 'nesports-pro-store/assets/images/hero-speed-ball.png' },
  { id: 'model_red_straps', path: 'nesports-pro-store/assets/images/model-lifting-straps-red.jpg' },
  { id: 'model_belt_v1', path: 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/crimson_red_powerlifting_lever_belt_lifter_1794825761133.jpg' },
  { id: 'model_belt_v2', path: 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/crimson_red_lever_belt_lifter_v2_1794825782685.jpg' },
  { id: 'slide_straps', path: 'nesports-pro-store/assets/images/hero-slide-lifting-straps.jpg' },
  { id: 'slide_knee', path: 'nesports-pro-store/assets/images/hero-slide-knee-wraps.jpg' },
  { id: 'slide_speed', path: 'nesports-pro-store/assets/images/hero-slide-speed-ball.jpg' }
];

candidates.forEach(c => {
  console.log(c.id, fs.existsSync(c.path));
});
