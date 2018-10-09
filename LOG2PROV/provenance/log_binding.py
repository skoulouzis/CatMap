from prov.model import ProvDocument, Namespace, Literal, PROV, Identifier
from .binding_var import *


class LogBinding():
    def __init__(self,log_dic):
        self._binding_dict = {}
        namespaces = [{'prov':'http://www.w3.org/ns/prov#'},{'tmpl':'http://openprovenance.org/tmpl#'},{'var':'http://openprovenance.org/var#'},{'vre':'https://www.vre4eic.eu/log#'}]
        self._binding_dict['namespaces'] = namespaces
        
        vars = []
        if('request_url_username' in log_dic and log_dic['request_url_username']):
            vars.append(LogVar('request_url_username','Entity','2dvalue_0_0', log_dic['request_url_username']))

        vars.append(LogVar('ip','Entity','2dvalue_0_0', log_dic['remote_host']))
        vars.append(LogVar('status','Entity','2dvalue_0_0', log_dic['status']))
        vars.append(LogVar('bytes','Entity','2dvalue_0_0', log_dic['response_bytes_clf']))
        vars.append(LogVar('url','Entity','2dvalue_0_0', log_dic['request_url']))
        vars.append(LogVar('method','Entity','2dvalue_0_0', log_dic['request_method']))
        vars.append(LogVar('version','Entity','2dvalue_0_0', log_dic['request_http_ver']))
        vars.append(LogVar('time','Entity','value_0', log_dic['time_received_tz_isoformat']))
        
        self._binding_dict['vars'] = vars
        

    
    @property
    def binding_dict(self):
        return self._binding_dict

    @binding_dict.setter
    def binding_dict(self, value):
        self._binding_dict = value

    @binding_dict.deleter
    def binding_dict(self):
        del self._binding_dict
        
        
    @property
    def vars_str(self):
        vars_str = ''
        for var in  self._binding_dict['vars']:
            vars_str+='var:'+var.var_name+' a prov:'+var.prov_type+' ;\n\t'+'tmpl:'+var.template_value_type+' "'+var.value+'" .\n'
        return vars_str.rstrip()
    
    @property
    def namespaces(self):
        return self._binding_dict['namespaces']