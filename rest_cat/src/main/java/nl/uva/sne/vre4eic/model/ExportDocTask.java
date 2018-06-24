/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package nl.uva.sne.vre4eic.model;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.MessageProperties;
import gr.forth.ics.isl.exception.GenericException;
import gr.forth.ics.isl.exporter.CatalogueExporter;
import gr.forth.ics.isl.exporter.D4ScienceExporter;
import io.micrometer.core.instrument.MeterRegistry;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Collection;
import java.util.concurrent.Callable;
import java.util.concurrent.TimeoutException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.codec.binary.Base64;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.metrics.MetricsEndpoint;

/**
 *
 * @author S. Koulouzis
 */
public class ExportDocTask implements Callable<String> {

    private final String catalogueURL;
    private final ConnectionFactory factory;

    @Autowired
    MetricsEndpoint endpoint;

    @Autowired
    MeterRegistry meterRegistry;
    private final String queue;

    public ExportDocTask(String catalogueURL, ConnectionFactory factory, String queue) {
        this.catalogueURL = catalogueURL;
        this.factory = factory;
        this.queue = queue;
    }

    private void exportDocuments(String catalogueURL) throws MalformedURLException, GenericException {

        try {
            CatalogueExporter exporter = getExporter(catalogueURL);
            Collection<String> allResourceIDs = exporter.fetchAllDatasetUUIDs();
            for (String resourceId : allResourceIDs) {
                JSONObject resource = exporter.exportResource(resourceId);
                String xml = exporter.transformToXml(resource);
                try (Connection connection = factory.newConnection(); Channel channel = connection.createChannel()) {
                    String qName = queue;
                    channel.queueDeclare(qName, true, false, false, null);
                    byte[] encoded = (Base64.encodeBase64(xml.getBytes()));
                    String message = new String(encoded, "UTF-8");

                    channel.basicPublish("", qName,
                            MessageProperties.PERSISTENT_TEXT_PLAIN,
                            message.getBytes("UTF-8"));

                } catch (TimeoutException ex) {
                    Logger.getLogger(ExportDocTask.class.getName()).log(Level.SEVERE, null, ex);
                }

            }

//            Set<String> names = endpoint.listNames().getNames();
//        endpoint.metric(catalogueURL, list);
        } catch (IOException ex) {
            Logger.getLogger(ExportDocTask.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private CatalogueExporter getExporter(String catalogueURL) {
        return new D4ScienceExporter(catalogueURL);
    }

    @Override
    public String call() throws Exception {
        exportDocuments(this.catalogueURL);
        return null;
    }
}