(ns nevergreen.http
  (:require [clj-http.client :as client]
            [clojure.tools.logging :as log]
            [clojure.string :as s]
            [nevergreen.errors :refer [create-error]])
  (:import (java.net UnknownHostException URISyntaxException)
           (clojure.lang ExceptionInfo)))

(def ^:const ten-seconds 10000)
(def ^:const thirty-seconds 30000)

(defn http-get [url additional-headers]
  (log/info (str "GETing from [" url "]..."))
  (try
    (let [res (client/get url {:insecure?             true
                               :socket-timeout        thirty-seconds
                               :conn-timeout          ten-seconds
                               :headers               (merge {"Accept" "application/xml"} additional-headers)
                               :as                    :stream
                               :throw-entire-message? true})]
      (log/info (str "GET from [" url "] returned a status of [" (:status res) " " (:reason-phrase res) "]"))
      (:body res))
    (catch UnknownHostException e
      (let [host (first (s/split (.getMessage e) #":"))
            msg (str host " is an unknown host")]
        (log/info (str "GET from [" url "] threw an UnknownHostException [" msg "]"))
        (create-error msg url)))
    (catch URISyntaxException e
      (let [msg (.getMessage e)]
        (log/info (str "GET from [" url "] threw a URISyntaxException [" msg "]"))
        (create-error msg url)))
    (catch ExceptionInfo e
      (let [data (ex-data e)
            msg (str (:status data) " " (:reason-phrase data))]
        (log/info (str "GET from [" url "] returned a status of [" msg "]"))
        (create-error msg url)))))
