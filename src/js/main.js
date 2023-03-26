import '../css/style.scss'
import * as THREE from "three";
import barba from '@barba/core';
import { gsap, Circ } from "gsap";
import vertexSource from "./shader/vertexShader.glsl";
import fragmentSource from "./shader/fragmentShader.glsl";
import { replaceHead } from './replace';
import { radian } from './utils';


class Main {
  constructor() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.canvas = document.querySelector("#canvas");
    this.renderer = null;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.cameraFov = 45;
    this.cameraFovRadian = (this.cameraFov / 2) * (Math.PI / 180);
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian);
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.group = new THREE.Group();

    this.isRotation = true;

    this.uniforms = {
      uTime: {
        value: 0.0
      },
      uSpeed: {
        value: 2.0
      },
      //振幅
      uWave: {
        value: 0.0
      },
      //周波数
      uFrequency: {
        value: 0.0
      },
      uColor1: {
        value: new THREE.Color(0xd43f8c)
      },
      uColor2: {
        value: new THREE.Color(0x014fc4)
      },
    };

    this.clock = new THREE.Clock();

    this.init();
  }

  _setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  _setCamera() {
    //ウインドウとWebGL座標を一致させる
    this.camera = new THREE.PerspectiveCamera(this.cameraFov, this.viewport.width / this.viewport.height, 1, this.cameraDistance * 2);
    this.camera.position.z = this.cameraDistance;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  }

  _setLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1);
    this.scene.add(light);
  }

  _addMesh() {

    //ジオメトリ
    // this.geometry = new THREE.SphereGeometry(this.viewport.height * 0.4, 128, 128);
    this.geometry = new THREE.IcosahedronGeometry(this.viewport.height * 0.4, 24);


    //マテリアル
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
      wireframe: true,
    });

    //メッシュ
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.group.add(this.mesh);
  }

  init() {
    this.scene.add(this.group);
    this._setRenderer();
    this._setCamera();
    this._setLight();
    this._addMesh();

    this._update();
    this._addEvent();
  }

  _update() {
    const elapsedTime = this.clock.getElapsedTime();
    this.uniforms.uTime.value = elapsedTime;

    if(this.isRotation) {
      this.mesh.rotation.y -= 0.001;
    }

    //レンダリング
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this._update.bind(this));
  }

  _onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    // レンダラーのサイズを修正
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    // カメラのアスペクト比を修正
    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();
    // カメラの位置を調整
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian); //ウインドウぴったりのカメラ距離
    this.camera.position.z = this.cameraDistance;
    // uniforms変数に反映
    // this.mesh.material.uniforms.uResolution.value.set(this.viewport.width, this.viewport.height);
    // meshのscale設定
    // const scaleX = Math.round(this.viewport.width / this.mesh.geometry.parameters.width * 100) / 100 + 0.01;
    // const scaleY = Math.round(this.viewport.height / this.mesh.geometry.parameters.height * 100) / 100 + 0.01;
    // this.mesh.scale.set(scaleX, scaleY, 1);
  }

  _addEvent() {
    window.addEventListener("resize", this._onResize.bind(this));
  }


  anim01() {
    const tl = gsap.timeline();
    tl.to(this.group.rotation, {
      y: radian(0),
      duration: 0.6,
      ease: Circ.easeInOut,
    })
    .to(this.group.position, {
      x: this.viewport.width * 0.2,
      y: 0,
      z: this.viewport.width * 0.3,
      duration: 0.8,
      ease: Circ.easeInOut,
    }, '<')
    .to(this.uniforms.uWave, {
      value: 0.0,
      duration: 0.8,
      ease: Circ.easeInOut,
    }, '<')
    .to(this.uniforms.uFrequency, {
      value: 0.05,
      duration: 0.8,
      ease: Circ.easeInOut,
    }, '<')

    this.isRotaion = true;

    this.uniforms.uColor1.value = new THREE.Color(0xd43f8c);
    this.uniforms.uColor2.value = new THREE.Color(0x014fc4);

    this.mesh.material.wireframe = true;
  }

  anim02() {
    // const tl = gsap.timeline({ repeat: -1 });
    const tl = gsap.timeline();
    tl.to(this.group.rotation, {
      y: radian(720),
      duration: 0.6,
      ease: Circ.easeInOut,
    })
    .to(this.group.position, {
      x: 0,
      y: -this.viewport.height * 0.4,
      z: 100,
      duration: 0.8,
      ease: Circ.easeInOut,
    }, '<')
    .to(this.uniforms.uWave, {
      value: 40.0,
      duration: 0.8,
      ease: Circ.easeInOut,
    }, '<')
    .to(this.uniforms.uFrequency, {
      value: 0.05,
      duration: 0.8,
      ease: Circ.easeInOut,
    }, '<')

    this.isRotaion = false;

    this.uniforms.uColor1.value = new THREE.Color(0xf83600);
    this.uniforms.uColor2.value = new THREE.Color(0xf9d423);

    this.mesh.material.wireframe = true;
  }

  anim03() {
    const tl = gsap.timeline();
    tl.to(this.group.rotation, {
      y: radian(0),
      duration: 0.8,
      ease: Circ.easeInOut,
    })
    .to(this.group.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.8,
      ease: Circ.easeInOut,
    }, '<')
    .to(this.uniforms.uWave, {
      value: 10.0,
      duration: 0.8,
      ease: Circ.easeInOut,
    }, '<')
    .to(this.uniforms.uFrequency, {
      value: 0.005,
      duration: 0.8,
      ease: Circ.easeInOut,
    }, '<')

    this.isRotaion = false;

    this.uniforms.uColor1.value = new THREE.Color(0xf4d03f);
    this.uniforms.uColor2.value = new THREE.Color(0x16a085);

    this.mesh.material.wireframe = true;
  }
}

const main = new Main();




const links = document.querySelectorAll('a[href]');
const cbk = function(e) {
 if(e.currentTarget.href === window.location.href) {
   e.preventDefault();
   e.stopPropagation();
 }
};
for(let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', cbk);
}


barba.init({
  sync: true,
  // transitions: [{
  //   name: 'default-transition',
  //   leave(data) {
  //     return gsap.to(data.current.container, {
  //       opacity: 0
  //     });
  //   },
  //   enter(data) {
  //     return gsap.from(data.next.container, {
  //       opacity: 0
  //     });
  //   }
  // }],
  //無効にする条件 trueの場合無効化
  prevent: ({ el }) => (el.classList && el.classList.contains('ab-item')),
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        main.anim01();
        window.scrollTo(0, 0);
        document.body.classList.remove(...document.body.classList);
        document.body.classList.add('page-home');
      }
    },
    {
      namespace: 'page2',
      beforeEnter() {
        main.anim02();
        window.scrollTo(0, 0);
        document.body.classList.remove(...document.body.classList);
        document.body.classList.add('page-2');
      }
    },
    {
      namespace: 'page3',
      beforeEnter() {
        main.anim03();
        window.scrollTo(0, 0);
        document.body.classList.remove(...document.body.classList);
        document.body.classList.add('page-3');
      }
    }
  ]
});

barba.hooks.beforeEnter((data) => {
  replaceHead(data);
});
