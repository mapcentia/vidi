# -*- coding: utf-8 -*-
"""
Created on Mon Sep 30 2019
@author: NielsClaes, OleMunchJohansen

"""
import pandas as pd
import numpy as np
#import time
import psycopg2
import pandas.io.sql as sqlio
#    import geopandas as gpd
from shapely.geometry import Point, LineString
#from scipy import interpolate
#from plotly.offline import plot
import plotly.graph_objs as go
import math
import plotly

#import os 
import json
import sys


# dx=np.power(588000-605000,2)
# dy=np.power(6122000-6114000,2)
# length=np.sqrt(dx+dy)

#json_str = '{"coordinates": [[554523, 6316535], [557474, 6318415]], "DGU_nr": [" 34.   19"," 34.   20"," 34.  739"," 34. 1363"," 34. 1443", " 34. 1775"," 34. 1930"," 34. 2513"," 34. 2576"," 34. 2577"," 34. 2582"," 34. 2585"," 34. 2586"," 34. 2587"," 34. 2588"," 34. 2589"," 34. 2590"," 34. 2599"," 34. 2600"," 34. 2606"," 34. 2612"," 34. 2613"," 34. 2614"," 34. 2615"," 34. 2618"," 34. 2623"," 34. 2849"," 34. 3244"," 34. 3629"," 34. 3866"," 34. 3873"], "Profile_depth": -180, "layers":["Potentialekort_Aalborg_config.txt","FOHMJ_config.txt"],"overlap":[[[0,3500]],[[0,3500]]],"Compound":"1176"}'
# FYN MODEL TEST
# json_str = '{"coordinates": [[587600, 6138900], [589500, 6138900]], "DGU_nr": [""], "Profile_depth": -180, "layers":["Fyn_config.txt"],"overlap":[[[0,1900]],[[0,1900]]],"Compound":""}'
# json_str = '{"coordinates": [[588000, 6122000], [605000, 6114000]], "DGU_nr": ["155.  224","155. 1427","155. 1072"], "Profile_depth": -180, "layers":["Fyn_config.txt","Potentialekort_Fyn_2004_config.txt"],"overlap":[[[0,18788]],[[0,18788]]],"Compound":""}'
# json_str = '{"coordinates": [[555293, 6123143], [605000, 6114000]], "DGU_nr": [""], "Profile_depth": -180, "layers":["Fyn_config.txt","Potentialekort_Fyn_2004_config.txt"],"overlap":[[[0,50000]],[[0,50000]]],"Compound":""}'

#start = time.time()
def profiletool_v5(json_str): ##Json string med coordinates DGU_nr Profile_depth
 
    inputdata = json.loads(json_str)
     
    pkter = inputdata['coordinates']

    overlap = []
    if 'overlap' in inputdata:
        overlap = inputdata['overlap']
   
    
    Line_in=LineString(pkter)
    x_coo,y_coo=Line_in.xy    
    # length of each section and the calculation of what part of the total length it constitutes
        
    total_length=Line_in.length  
    
    length=[]
    andel=[]
    
    
    for i in range(0,(len(x_coo))-1):
        pt1=Point(pkter[i])
        pt2=Point(pkter[i+1])
        l=pt1.distance(pt2)
        length.append(l)
        andel.append(l/total_length)
    
    
    # interpolate n points between two coordinates where n is andel*total points on the graph
    
    n=[]
    total_points=np.int(total_length/3) # changed from 33 to 3
    if total_points>1000:
            total_points = 1000
            
    x_interp=[]
    y_interp=[]
    
    
    for i in range(0,len(andel)):
        inter=np.ceil(andel[i]*total_points)
        n.append(inter)
        
        transect=LineString([(x_coo[i],y_coo[i]),(x_coo[i+1],y_coo[i+1])])
        x_interp.append(x_coo[i])
        y_interp.append(y_coo[i])                    
            
        for j in range(0,(int(n[i]))):
            delta=1/n[i]
            r=transect.interpolate((j+1)*delta,normalized=True)
            x_interp.append(r.x)    #x coo af punktet på linje
            y_interp.append(r.y)    #y coo af punktet på linje
            
    #afstand fra starten af linjen
    
    x_profile=[]
    x_profile.append(np.sqrt(np.square(x_coo[0]-x_interp[0])+np.square(y_coo[0]-y_interp[0]))) 
    
    for i in range(0,len(x_interp)-1):
        short=np.sqrt(np.square(x_interp[i+1]-x_interp[i])+np.square(y_interp[i+1]-y_interp[i]))
        x_profile.append(x_profile[i]+short)
    
    
    y_max_temp =[]
    y_range_max = 0
    n_points = np.size(x_interp)
    data=[]
    data_type=[]
    ### gennemgå alle lag for at vurdere om det er en geologisk model
    modeltype=[]
    if 'layers' in inputdata:
        for k in range(0,len(inputdata['layers'])):
            InputFile = open(inputdata['layers'][k])
            Lines=InputFile.readlines()
            model_type = Lines[2].split(' ')[4].split('\n')[0]
            Input_overlap = inputdata['overlap'][k]
            modelnavn = inputdata['layers'][k]
            modeltype.append([k , model_type, modelnavn, Input_overlap])
    
    modeltype.sort(key = lambda modeltype: modeltype[1])      #sorter alfabetisk, geologi, hydrogeologi, potentiale,
    models = []
    overlaps = []
    for k in range(0,len(modeltype)):
        models.append(modeltype[k][2])
        overlaps.append(modeltype[k][3])
        
    inputdata['layers'] = models
    inputdata['overlap'] = overlaps
    overlap = inputdata['overlap'] #### ADDED OMU 29-11-2019 TRY FIX BUG WITH LAYERS OVERLAP SWITCHED
        
    for k in range(0,len(overlap)): #forskellige modeller som skal optegnes)
        
        
        inputmodel  = inputdata['layers'][k]
        InputFile=open(inputmodel)
        Lines=InputFile.readlines()
        InputFile.close()
        modeldata = np.load(Lines[3].split(' ')[1].split('\n')[0], mmap_mode='r') ## mmap_mode='r' sørger for at filen ikke læses ind i hukommelsen, men dele læses ud i løbet af processen
        model_type = Lines[2].split(' ')[4].split('\n')[0]
        layerinfo = Lines[4].split(' ')[1].split('\n')[0]
        ulx = float(Lines[6].split(' ')[2])
        uly = float(Lines[7].split(' ')[2])
        cellsize = float(Lines[8].split(' ')[2])
#        Nx = int(Lines[9].split(' ')[1])
#        Ny = int(Lines[10].split(' ')[1])
        Nz = int(Lines[11].split(' ')[1])
        
        
        for l in range(0,len(overlap[k])): ###  OMU HVORFOR DETTE LOOP??
            start_pkt = overlap[k][l][0]
            id_start = int(0)
            dist = abs(start_pkt - x_profile[0])
            for m in range(len(x_profile)):
                if abs(start_pkt-x_profile[m])<dist:
                    dist = start_pkt-x_profile[m]
                    id_start = m
            id_start_just = id_start+1
            
            end_pkt = overlap[k][l][1]
            id_end = int(0)
            dist = abs(end_pkt - x_profile[0])
            for m in range(len(x_profile)):
                if (abs(end_pkt-x_profile[m]))<dist:
                    id_end = m
                    dist = abs(end_pkt-x_profile[m])
            id_end_just = id_end - 1
                    
            values = np.zeros((id_end_just-id_start_just+1,Nz),dtype=np.float16)
            id_list = list(range(id_start_just,id_end,1))
            
    
        
            for n in range(len(id_list)):
                #ip = (x[0]+n*stepx-ulx)/cellsize  # x[0]+n*stepx-ulx : x vaerdie på linje
                ip = (x_interp[id_list[n]]-ulx)/cellsize
                #jp = (uly-(y[0]+n*stepy))/cellsize # uly-(y[0]+n*stepy) : y vaerdie på linje
                jp = (uly-y_interp[id_list[n]])/cellsize 
             
                if total_length/(n_points-1) < math.sqrt(cellsize*cellsize):    # Der interpoleres værdier (diagonal af cellen istedet for cellsize)
                    # find j,i for 4 cells that goes into interpolation
                    
                    i1 = np.int(ip+0.5)
                    j1 = np.int(jp+0.5)
                    
                    i2 = np.int(ip+0.5)
                    j2 = np.int(jp-0.5)
                    
                    i3 = np.int(ip-0.5)
                    j3 = np.int(jp+0.5)
                    
                    i4 = np.int(ip-0.5)
                    j4 = np.int(jp-0.5)
                
            
                    # calc weigths for interpolation
            
                    a=(ip-int(ip))
                    b=(jp-int(jp))
                    
                    if (a<=0.5 and b<=0.5): #Hvis punkt i felt 1 (nedre højre firkant)
                        w1 = (0.5+a)*(0.5+b)
                        w2 = (0.5+a)*(0.5-b)
                        w3 = (0.5-a)*(0.5+b)
                        w4 = (0.5-a)*(0.5-b)
                        
                    if (a>=0.5 and b<=0.5): #Hvis punkt i felt 3 (nedre venstre firkant)
                        w1 = (a-0.5)*(0.5+b)
                        w2 = (a-0.5)*(0.5-b)
                        w3 = (1.5-a)*(0.5+b)
                        w4 = (1.5-a)*(0.5-b)
                        
                    if (a<=0.5 and b>=0.5): #Hvis punkt i felt 2 (øvre højre firkant)
                        w1 = (0.5+a)*(b-0.5)
                        w2 = (0.5+a)*(1.5-b)
                        w3 = (0.5-a)*(b-0.5)
                        w4 = (0.5-a)*(1.5-b)
                        
                    if (a>=0.5 and b>=0.5): #Hvis punkt i felt 4 (øvre venstre firkant)
                        w1 = (a-0.5)*(b-0.5)
                        w2 = (a-0.5)*(1.5-b)
                        w3 = (1.5-a)*(b-0.5)
                        w4 = (1.5-a)*(1.5-b)
                
                    if Nz > 1:
                        for i in range(Nz):
                            # for all layers calculate interpolated value
                            values[n,i]=((w1*modeldata[j1,i1,i]+w2*modeldata[j2,i2,i]+w3*modeldata[j3,i3,i]+w4*modeldata[j4,i4,i])/(w1+w2+w3+w4))
                    else:
                        values[n,0]=((w1*modeldata[j1,i1]+w2*modeldata[j2,i2]+w3*modeldata[j3,i3]+w4*modeldata[j4,i4])/(w1+w2+w3+w4))
                
                elif Nz > 1:
                    for i in range(Nz):
                        # for all layers extract value in cell
                        values[n,i]=(modeldata[np.int(jp),np.int(ip),i])
                else:
                        # extract value in cel
                        values[n,0]=(modeldata[np.int(jp),np.int(ip)])
    
    
            inventory = pd.read_csv(layerinfo,sep=';')
            #inventory = inventory.drop('navn',1)
    
    ## y_max bruges til at definere toppen af grafen (yaxis range)
            y_max_temp = max (values[:,0])
            if y_max_temp > y_range_max:
                y_range_max = y_max_temp
               
                
            plot_data=pd.DataFrame()
            
            plot_data['x']=x_profile[id_start_just:id_end]
            
            if model_type == 'geology':
                
                plot_data['top']=values[:,0]
                
                legend_list=[]
                   # f=open('legend.txt', 'w',encoding='utf-8')
                legend_list.append(inventory['legend'][0])
            
                
                b=0
                farve=[] 
                for i in range(1,(np.shape(values)[1])): #1 to 0
                    tyk = values[:,i]-values[:,i-1]
                    if min(tyk) < -0.5:
                        b=b+1
                        navn = 'bund'+str(b)
                        plot_data[navn]=values[:,i]
                        legend_list.append(inventory['legend'][i])
            
                        farve.append(inventory['farve'][i])
                if len(farve) == 0:
                     farve=['rgb(0,0,0)']
            
                
                afarve=[]
                test1=[]
                
                for i in range(0,len(farve)):
                    test=farve[i][4:int(len(farve[i])-1)].split(',')
                    test1.append(test)
                    line=str('rgba('+test[0]+','+test[1]+','+test[2]+',0.9)')
                    afarve.append(line)
        
            
            
                Topo = plot_data
                laglist=legend_list
                
                
                
                trace = go.Scatter(
                    x = Topo.x.tolist(),
                    y = Topo.iloc[:, 1].tolist() ,
                    line = dict(
                    color = ('rgb(0, 0, 0)'),
                    width = 3,
                    dash = 'dash'),
                
                    #
                #    fill='tonexty',
                #    fillcolor='rgba(147,69,1,1)',
                    opacity = 1.0,
                 
                    )
                data.append(trace)
                data_type.append('lag')
                
                y_max=max(Topo.iloc[:, 1].tolist())
                
                for l in range(0,len(Topo.columns)-2): #creating the layers with coloring of the full layer
            
                    
                
                    trace = go.Scatter(x = Topo.x.tolist() , y = Topo.iloc[:, l+2].tolist()  , line = dict(color = (farve[l]), width = 2), fill='tonexty', fillcolor = afarve[l], hoverinfo=None)
                    data.append(trace)
                    data_type.append('lag')
                        
            
                for l in range(len(Topo.columns),1,-1): #creating the lines with a name appearing when hovering over it
                    
                    trace = go.Scatter(x = Topo.x.tolist() , y = Topo.iloc[:, l-1].tolist()  , line = dict(color = (farve[l-3]), width = 2), name=laglist[l-2], hoverinfo='name' )
                    data.append(trace)
                    data_type.append('lag')
                  
                  
                trace = go.Scatter(
                    x = Topo.x.tolist(),
                    y = Topo.iloc[:, 1].tolist() ,
                    line = dict(
                    color = ('rgb(0, 0, 0)'),
                    width = 3,
                    dash = 'dash'),
                
                    #
                #    fill='tonexty',
                #    fillcolor='rgba(147,69,1,1)',
                    opacity = 1.0,
                    name='terræn',
                    hoverinfo= 'name',
                    )
                data.append(trace)
                data_type.append('lag')
            
            if model_type == 'terrain':
                
                trace = go.Scatter(
                    x = plot_data['x'],
                    y = values[:, 0].tolist() ,
                    line = dict(
                    color = ('rgb(0, 0, 0)'),
                    width = 3,
                    dash = 'dash'),
                
                    #
                #    fill='tonexty',
                #    fillcolor='rgba(147,69,1,1)',
                    opacity = 1.0,
                    name='terræn',
                    hoverinfo = 'name'
                 
                    )
                data.append(trace)
                data_type.append('lag')
                
            if model_type == 'potential':
                trace = go.Scatter(
                    x = plot_data['x'],
                    y = values[:, 0].tolist() ,
                    line = dict(
                    color = ('rgb(0, 0, 255)'),
                    width = 3),
                
                    #
                #    fill='tonexty',
                #    fillcolor='rgba(147,69,1,1)',
                    opacity = 1.0,
                    name='grundvandspotentiale',
                    hoverinfo = 'name'
                 
                    )
                data.append(trace)
                data_type.append('lag')
                
            y_max = 0

            for i in range(0,len(data)):
                if y_max < (max(data[i]['y'])):
                    y_max = max(data[i]['y']) 

    #endlag = time.time()
    #print('optegning af lag:'+str(endlag-startlag)+'s')
    #################################################### 
    #### Boringer
    ####################################################
    
    
    
    Color = pd.read_csv('RockSymbol_color_code.csv',sep='\t',encoding = 'utf-8')
    Color = Color.set_index('symbol')
    
    ## Connect to GC2
    try:

           conn = psycopg2.connect(dbname="jupiter", user="watsonc", password="wBx6nZCE", host="pg_mapcentia.gc2.io")
    except:
        print ("I am unable to connect to the database")
        #sys.exit() 
    
    
    line = Line_in #gpd.read_file("Astrup_NS.shp") #profil linje
    
## HENT LISTE OVER DGU BORINGER
    annotations =[]
    DGU=inputdata['DGU_nr']

    compoundnr=''
    if 'Compound' in inputdata:
        compoundnr=inputdata['Compound']

    txt="("
    for count, i in enumerate(DGU):
        if count < (len(DGU)-1):
            txt=txt+"'"+i+"',"
        else:
            txt=txt+"'"+i+"')"
       
    

    # data_position: boringsplacering + filter
        #data_litho: lithologi som skal med på profilen

    #start_db_data = time.time()
    
    if len(DGU)>0:
        if len(DGU[0])>0:       
            data_position = sqlio.read_sql_query("SELECT borehole.drilldepth,borehole.boreholeno, borehole.xutm, borehole.yutm, borehole.elevation, screen.intakeno, screen.top, screen.bottom, screen.screenno FROM pcjupiterxlplusviews.borehole Left Join pcjupiterxlplusviews.screen ON borehole.boreholeno=screen.boreholeno WHERE borehole.boreholeno in"+txt ,conn)
            data_position = data_position.sort_values(['boreholeno','intakeno','top'],ascending=[True, True,False])
            #data_position = sqlio.read_sql_query("SELECT borehole.boreholeno, borehole.xutm, borehole.yutm, borehole.elevation, screen.intakeno, screen.top, screen.bottom, screen.screenno FROM pcjupiterxlplusviews.borehole Inner Join pcjupiterxlplusviews.screen ON borehole.boreholeno=screen.boreholeno WHERE borehole.boreholeno in"+txt ,conn)
            data_litho = sqlio.read_sql_query("SELECT lithsamp.boreholeno, lithsamp.top, lithsamp.bottom, lithsamp.rocksymbol FROM pcjupiterxlplusviews.lithsamp WHERE lithsamp.boreholeno in"+txt ,conn)
            if len(str(compoundnr))>0:
                
                #data_kemi = sqlio.read_sql_query("SELECT borehole.boreholeno, grwchemanalysis.compoundno, compoundlist.long_text, grwchemsample.sampledate, grwchemanalysis.attribute, grwchemanalysis.amount, intake.intakeno FROM pcjupiterxlplusviews.BOREHOLE INNER JOIN ((pcjupiterxlplusviews.INTAKE INNER JOIN pcjupiterxlplusviews.GRWCHEMSAMPLE ON (INTAKE.BOREHOLENO = GRWCHEMSAMPLE.BOREHOLENO) AND (INTAKE.INTAKENO = GRWCHEMSAMPLE.INTAKENO)) INNER JOIN (pcjupiterxlplusviews.GRWCHEMANALYSIS INNER JOIN pcjupiterxlplusviews.COMPOUNDLIST ON GRWCHEMANALYSIS.COMPOUNDNO = COMPOUNDLIST.COMPOUNDNO) ON GRWCHEMSAMPLE.SAMPLEID = GRWCHEMANALYSIS.SAMPLEID) ON BOREHOLE.BOREHOLENO = INTAKE.BOREHOLENO WHERE (((GRWCHEMANALYSIS.COMPOUNDNO)="+str(compoundnr)+") AND ((BOREHOLE.BOREHOLENO) in "+txt+"))", conn);
                # faster chemistry from materialized view
                data_kemi = sqlio.read_sql_query('SELECT* FROM chemicals."ChemicalsProfileTool" WHERE (((compoundno)='+str(compoundnr)+') AND ((boreholeno) in '+txt+'))', conn)
                data_limit  = sqlio.read_sql_query("SELECT compunds.compundno, compunds.unit, compunds.limit, compunds.attention FROM codes.compunds WHERE compunds.compundno in ("+str(compoundnr)+")",conn)
                ## find placering på profilen
                data_kemi = data_kemi.sort_values(['boreholeno','intakeno','sampledate'])
        #end_db_data = time.time() 
        #print('hentning af jupiterdata'+str(end_db_data-start_db_data))
        
        
        
        #### OPTEGNING AF BORINGER ############################################
        
        ##### OPTEGNING AF BORINGSKANT OG FILTRE PÅ BORINGER UDEN GEOLOGI #########
    #    start_tegn_boringer = time.time()
    #
        
    
    
            for i in DGU: 
                try:
                    x = data_position.loc[data_position['boreholeno'] == i].xutm.unique()
                    y = data_position.loc[data_position['boreholeno'] == i].yutm.unique()
                
                    p2=Point(x,y)
                    inters=line.interpolate(line.project(p2))
            #        x_proj=inters.coords[0][0]
            #        y_proj=inters.coords[0][1]
                    
                     #Beregning af afstand fra start fra linjen til hvor boringen skal sættes på profilen
                    
                    pts=line.coords
                    d=0 #x afstand på profilen
                    j=0
                    L=LineString([pts[j],pts[j+1]])
                    pt=inters
                    while (L.distance(pt)>1.00e-4):
                        pt1=Point(pts[j])
                        pt2=Point(pts[j+1])
                        d=d+pt1.distance(pt2)
                        j=j+1
                        L=LineString([pts[j],pts[j+1]])
                    
                    pt1=Point(pts[j])
                    d=d+pt1.distance(pt) #x afstand på profilen
                #    dist.append(d)
                    
                   
                    
                    litho = data_litho.loc[data_litho['boreholeno'] == i].sort_values(by=['top']).reset_index()
                    lag=np.zeros(len(litho))
                    for k in range(0,(len(litho)-1)):
                        if (litho['rocksymbol'][k]==litho['rocksymbol'][k+1]):
                            lag[k+1]=lag[k]
                        else: 
                            lag[k+1]=lag[k]+1
                    litho['lag']=lag.tolist()
                    
                    bars = litho['lag'].unique()
                    
                    bar_width = 0.1#total_length/100 ## relateres til zoomniveau in fremtiden
                #    y_l=[]
                #    y_b=[]
                #    nr=[]
                #    afsta=[]
                
                
                
                #### OPTEGNING AF BORING OUTLINE ############################################   


                    trace = go.Bar(
                            x = [d],
                            y = [data_position.loc[data_position['boreholeno'] == i].drilldepth.unique()[0]],
                            opacity = 1.0,
            
                            width = bar_width,
                            base = data_position.loc[data_position['boreholeno'] == i].elevation.unique()[0]-data_position.loc[data_position['boreholeno'] == i].drilldepth.unique()[0], ###terræn - drilldepth
                            hoverinfo ='none',
                            marker = dict(color ='rgba(0, 0, 0,1)',line = dict(color = 'rgba(0, 0, 0,1)',width = 16)),
                            yaxis='y2'
                            )
    
   
                    data.append(trace)   
                    data_type.append('boring')
                    

                  
                except:
                    print('nothing')
  
    
        #### OPTEGNING AF GEOLOGI I BORINGER#######################################
                for row in bars:   
                    try:
                            base_var = data_position.loc[data_position['boreholeno'] == i].elevation.unique()[0]-max(litho.loc[litho['lag']==row].bottom.unique())
                            y_var = -min(litho.loc[litho['lag']==row].top.unique())+max(litho.loc[litho['lag']==row].bottom.unique())
                            geocolor = Color.rgba[litho.loc[litho['lag']==row].rocksymbol.unique()[0]]
                            trace = go.Bar(
                                    x = [d],
                                    y = [y_var],
                                    opacity = 1.0,
                                    base = [base_var],
                                    #text =str(round(data_position.loc[data_position['boreholeno'] == i].elevation.unique()[0]-max(litho.loc[litho['lag']==row].bottom.unique()),1))+'(bund, kote)<br>'+litho.loc[litho['lag']==row].rocksymbol.unique()[0] +', '+ Color.tekst[litho.loc[litho['lag']==row].rocksymbol.unique()[0]],
                                    hoverinfo = 'none',
                                    width = bar_width,
                                    #hoverinfo ='text',
                                    marker = dict(color = geocolor,line = dict(color =geocolor,width = 12)), ###ÆNDRE OUTLINE TIL SORT IGEN
                                    name = litho.loc[litho['lag']==row].rocksymbol.unique()[0],
                                    yaxis='y2'
                                    )
                            data.append(trace) 
                            data_type.append('boring')
                            
                        # scatter punkter med hover text
                            
                            y = np.arange(base_var,base_var+y_var,1)
                            x = np.ones(len(y))*d
                            trace = go.Scattergl(
                            
                            y = y,
                            x =x,
                            mode = 'markers',
                            text =str(round(data_position.loc[data_position['boreholeno'] == i].elevation.unique()[0]-max(litho.loc[litho['lag']==row].bottom.unique()),1))+'(bund, kote)<br>'+litho.loc[litho['lag']==row].rocksymbol.unique()[0] +', '+ Color.tekst[litho.loc[litho['lag']==row].rocksymbol.unique()[0]],
                            hoverinfo ='text',
                            opacity=0,
                            marker=dict(
                            color=geocolor,
            
                            ))
                            data.append(trace)    

                            
                    except:  
                         'do nothing'
                         
                   
                ### OPTEGNING AF PILE OG DGU-NUMRE   
                annotations_ny=[dict(
                    x=d,
                    y=data_position.loc[data_position['boreholeno'] == i].elevation.unique()[0]+1,
                    xref='x',
                    yref='y',
                    text='<a href=\'http://data.geus.dk/JupiterWWW/borerapport.jsp?dgunr='+i.replace(" ","")+'\'>'+  i.replace(" ","")+'</a>', #fjerne mellemrum fra dgunr
                    showarrow=True,
                    arrowhead=3,
                    ax=0,
                    ay=-50,
                    textangle=-90,
                    )]
                                    
                annotations.extend(annotations_ny)
        

                ##### OPTEGNING AF FILTRE       
                screen = data_position.loc[data_position['boreholeno'] == i].intakeno.unique()   ## 30-09-2019 har rettet screenno til intakeno
                if screen[0]!= None: #hvis der er filteroplysninger om boringen
                    if ~np.isnan(screen[0]):
                        try:
                            screens = data_position.loc[data_position['boreholeno'] == i].reset_index()
                            for scr in range(len(screen)):
                                if len(str(compoundnr))>0: #hvis man vælger et stof
                                    concentration = data_kemi.loc[data_kemi['boreholeno'] == i].loc[data_kemi['intakeno'] == screen[scr]]
                                    
                                    if concentration.size:
                                        compound_navn = concentration.long_text.tail(1).values[0]
                                        max_chem = max(concentration.amount)
                                        date_max =pd.to_datetime(str(concentration[concentration['amount']==max_chem].sampledate.values[0]))
                                        date_max = date_max.strftime('%d.%m.%Y')
                                        att = concentration.loc[concentration['amount'] == max_chem]['attribute']
                                        if str(att.values[0]) == 'None':
                                            max_attribute = ""
                                        else:
                                            max_attribute = str(att.values[0])
                                        #concentration.sort_values(by='sampledate')
                                        last_chem = concentration.amount.tail(1).values[0]
                                        last_date = pd.to_datetime(str(concentration.sampledate.tail(1).values[0]))
                                        if str(concentration.attribute.tail(1).values[0]) == 'None':
                                            last_attribute = ""
                                        else:
                                            last_attribute = str(concentration.attribute.tail(1).values[0])
                                        date = last_date.strftime('%d.%m.%Y')#('%Y.%m.%d')
                                        
                                        if last_attribute =="<":
                                            latestFarve = '#10ae8c'
                                        else:
                                        
                                            if last_chem > data_limit['limit'][0]:
                                                latestFarve ='#fc3c3c'
                                            elif last_chem > data_limit['attention'][0]:
                                                latestFarve = '#f7a84d'
                                            else:
                                                latestFarve = '#10ae8c'
                
                                        if max_chem > data_limit['limit'][0]:
                                            maxFarve ='#fc3c3c'
                                        elif max_chem > data_limit['attention'][0]:
                                            maxFarve = '#f7a84d'
                                        else:
                                            maxFarve = '#10ae8c'
#                
#                                        
#                                        ## normal size
                                        
                                        y_var = (screens['bottom'][scr]-screens['top'][scr])#/2
                                        base_var  =data_position.loc[data_position['boreholeno'] == i].elevation.unique()[0]-screens['bottom'][scr]#+y_var
                                        latestTrace = go.Bar(
                                            x = [d],
                                            y = [y_var],
                                            opacity = 1.0,
                                            hoverinfo = 'none',
                                            width = bar_width,
                                            base = [base_var],
                                            marker = dict(
                                                color = latestFarve,
                                                line = dict(
                                                    width =6,
                                                    color = latestFarve,
                
                                                ),
                                            ),
                                            name = 'filter',
                                            yaxis='y2'
                                        )
                
                                        data.append(latestTrace)
                                        data_type.append('filter')
                                        
                                        ## tilføj scatterpunkter med hover text
                                        y = np.arange(base_var,base_var+y_var,0.1)
                                        x = np.ones(len(y))*d
                                        trace = go.Scattergl(
                                        
                                        y = y,
                                        x =x,
                                        mode = 'markers',
                                        text = '<b>DGU '+i+'</b><br>'+compound_navn+' '+data_limit['unit'][0]+'<br>Indtag '+str(int(screen[scr]))+'<br>maks ('+date_max+'): '+max_attribute+str(max_chem)+'<br>senest ('+str(date)+'):'+last_attribute+str(last_chem),
                                        hoverinfo ='text',
                                        opacity=0,
                                        marker=dict(

                                        color=latestFarve,
                        
                                        ))
                                        data.append(trace)  
                                                    


                #                        
                                    else: ## HVIS DER IKKE ER KEMI I BORINGEN
                                        ## normal size
                                        base_var = data_position.loc[data_position['boreholeno'] == i].elevation.unique()[0]-screens['bottom'][scr]
                                        y_var = screens['bottom'][scr]-screens['top'][scr]
                                        trace = go.Bar(
                                                    x = [d],
                                                    y = [y_var],
                                                    opacity = 1.0,
                                                    #text = 'Boring DGU '+i+'<br>Indtag '+str(int(screen[scr])),
                                                    hoverinfo = 'none',
                                                    width = bar_width,
                                                    base = [base_var],
                                                    marker = dict(
                                                        color = 'rgb(50,50,50)', 
                                                         line = dict(
                                                    width = 6,
                                                    color = 'rgba(50, 50, 50,1)',
                                                ),
                                                        ),
                                                    name = 'filter',
                                                    yaxis='y2'
                                                    )   
                                        data.append(trace)
                                        data_type.append('filter')
                
                                        ## tilføj scatterpunkter med hover text
                                        y = np.arange(base_var,base_var+y_var,0.1)
                                        x = np.ones(len(y))*d
                                        
                                        trace = go.Scattergl(
                                        y = y,
                                        x =x,
                                        mode = 'markers',
                                        text = '<b>DGU '+i+'</b>'+'<br>Indtag '+str(int(screen[scr]))+' <br>Ingen målinger' ,
                                        hoverinfo ='text',
                                        opacity=0,
                                        marker=dict(

                                        color='rgba(1, 0, 0,1)',
                        
                                        ))
                                        data.append(trace) 
                                        
                
                ###### HVIS DER IKKE ER VALGT KEMI PÅ FILTRE TEGNES GRÅ FILTRE
                                        
                                else:
                                        
                                        base_var = data_position.loc[data_position['boreholeno'] == i].elevation.unique()[0]-screens['bottom'][scr]
                                        y_var = screens['bottom'][scr]-screens['top'][scr]
                                        trace = go.Bar(
                                                    x = [d],
                                                    y = [y_var],
                                                    opacity = 1.0,
                                                    #text = 'Boring DGU '+i+'<br>Indtag '+str(int(screen[scr])),
                                                    hoverinfo = 'none',
                                                    width = bar_width,
                                                    base = [base_var],
                                                    marker = dict(
                                                        color = 'rgb(50,50,50)', 
                                                         line = dict(
                                                    width = 6,
                                                    color = 'rgba(50, 50, 50,1)',
                                                ),
                                                        ),
                                                    name = 'filter',
                                                    yaxis='y2'
                                                    )   
                                        data.append(trace)
                                        data_type.append('filter')
                
                                        ## tilføj scatterpunkter med hover text
                                        y = np.arange(base_var,base_var+y_var,0.1)
                                        x = np.ones(len(y))*d
                                        
                                        trace = go.Scattergl(
                                        y = y,
                                        x =x,
                                        mode = 'markers',
                                        text = '<b>DGU '+i+'</b><br>'+i.replace(" ","")+'<br>Indtag '+str(int(screen[scr]))+' <br>Ingen målinger' ,
                                        hoverinfo ='text',
                                        opacity=0,
                                        marker=dict(

                                        color='rgba(0, 0, 1,1)',
                        
                                        ))
                                        data.append(trace) 
                                        
        
                        except:  
                            'do nothing'        
        
        


     
          
    ## get profile depth from inputdata
    y_min = inputdata['Profile_depth']
    if 'data_position' in locals():
        if max(data_position['elevation'])>y_range_max:
            y_range_max = max(data_position['elevation'])

    layout = go.Layout(
                            showlegend=False,
                            annotations = annotations,
                            hovermode = "closest",
                                margin=dict(
                                l=50,
                                r=5,
                                b=45,
                                t=50,
                                pad=1
                            ),
                            xaxis=dict( title='Afstand [m]', 
                                ticklen=5,
                                zeroline=False,
                                gridwidth=2,
                                range=[min(x_profile),max(x_profile)]),
                            yaxis=dict(
                                title='Kote [m]',
                                ticklen=5,
                                gridwidth=2,
                               range=[y_min,y_range_max+0.2*y_range_max-0.2*y_min]),
                            yaxis2=dict(
                                ticklen=5,
                                gridwidth=2, 
                                overlaying='y',
                                range=[y_min,y_range_max+0.2*y_range_max-0.2*y_min]),
                             barmode='stack', #til at få alle bars ovenpå hinanden
                             hoverlabel=dict(namelength=100) #længde af labels
    
                            )
#        
    fig = go.Figure(data=data,layout=layout)
    
 
    #end = time.time()
    
    #plot(fig,auto_open=True,filename='testprofil_delete_me.html') # SKAL DEAKTIVERES I PRODUKTION
   
    
    
    

    JSON_data = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)


    print(JSON_data) #SKAL VÆRE AKTIV I PRODUKTION


#profiletool_v5(json_str) # SKAL DEAKTIVERES I PRODUKTION

if __name__ == "__main__":
    json_str = sys.argv[1]
    json_str=json_str.replace("'",'"')
    profiletool_v5(json_str)
