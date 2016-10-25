import random, math

WIDTH = 512
HEIGHT = 1024
TEMPLATE_DOCUMENT = """<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" version="1.1">
    <rect x="0" y="0" width="{width}" height="{height}" fill="white"/>
    <defs>
        <radialGradient id="cloud">
            <stop offset="10%" stop-color="#ccc"/>
            <stop stop-opacity="0" offset="95%" stop-color="#fff"/>
        </radialGradient>
    </defs>
{content}
</svg>"""

TEMPLATE_CIRCLE = """    <circle fill="url(#cloud)" cx="{x}" cy="{y}" r="{r}"/>"""

def createClouds():
    #  random.randint(a, b) b inclusive
    clouds = []
    for i in range(1, 40, 1):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT)
        r = random.randint(math.floor(WIDTH / 4), math.floor(WIDTH / 2))
        clouds.append(TEMPLATE_CIRCLE.format(**{"x": x, "y": y, "r": r}))
    return clouds

def main():
    doc_vars = {
        "width": WIDTH,
        "height": HEIGHT,
        "content": "\n".join(createClouds())
    }
    
    with open('background.svg', 'w') as f:
        f.write(TEMPLATE_DOCUMENT.format(**doc_vars))
        
    print 'done'
    
if __name__ == '__main__':
    main()