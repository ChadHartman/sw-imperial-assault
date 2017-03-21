namespace App.Animation {

    /**p {
  animation-duration: 3s;
  animation-name: slidein;
}

@keyframes slidein {
  from {
    margin-left: 100%;
    width: 300%; 
  }

  to {
    margin-left: 0%;
    width: 100%;
  }
} */

/**
 * var style = document.createElement('style');
style.type = 'text/css';
var keyFrames = '\
@-webkit-keyframes spinIt {\
    100% {\
        -webkit-transform: rotate(A_DYNAMIC_VALUE);\
    }\
}\
@-moz-keyframes spinIt {\
    100% {\
        -webkit-transform: rotate(A_DYNAMIC_VALUE);\
    }\
}';
style.innerHTML = keyFrames.replace(/A_DYNAMIC_VALUE/g, "180deg");
document.getElementsByTagName('head')[0].appendChild(style);
 * 
 */

    export class AnimationBuilder {

        public durationMs: number;



        public from(property: string, value: string): AnimationBuilder {
            return this;
        }

        public to(property: string, value: string): AnimationBuilder {
            return this;
        }

        public build(): string {
            return `@keyframes slidein {
  from {
    margin-left: 100%;
    width: 300%; 
  }

  to {
    margin-left: 0%;
    width: 100%;
  }
}
            `;
        }
    }
}