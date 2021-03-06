(ns nevergreen.errors
  (:require [cheshire.core :as json]))

(defn is-error? [o]
  (and (map? o) (contains? o :error)))

(defn create-error [message url]
  {:error message :url url})

(defn error-response [status message url]
  {:status  status
   :body    (json/generate-string (create-error message url) {:pretty true})
   :headers {"Content-Type" "application/json; charset=utf-8"}})
