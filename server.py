import sys
import cherrypy
import os.path
from cherrypy.lib.static import serve_file


class Server(object):
    @cherrypy.expose
    def index(self):
        return serve_file(os.path.join(current_dir, 'index.html'), content_type='text/html')


if __name__ == '__main__':
    DEFAULT_PORT = 8080
    current_dir = os.path.dirname(os.path.abspath(__file__))
    port = int(sys.argv[1]) if len(sys.argv) == 2 else DEFAULT_PORT 
    
    cherrypy.config.update({'server.socket_port': port})
    
    conf = {'/': {'tools.staticdir.on': True,
                  'tools.staticdir.dir': current_dir,
                  'tools.staticdir.content_types': {'html': 'text/html',
                                                    'js': 'text/javascript',
                                                    'css': 'text/css'}}}
    
    cherrypy.quickstart(Server(), '/', config=conf)
