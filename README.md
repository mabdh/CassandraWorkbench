
# CassandraWorkbench


##Prerequisites
<ul class = "task-list">
<li> Cassandra DB - 
   Download and install <a href="http://cassandra.apache.org/download/">Cassandra</a>. When running the application, you need to have the <code>cassandra -f</code> process running.
 </li>
 <li> Node.js - 
 	Download and install <a href="http://nodejs.org/download/">Node.js</a>
 </li>



</ul>

## Quick Install 
<ul class = "task-list"> 
<li>
Install bower and grunt globally using <pre><code>npm install -g bower grunt-cli</code></pre>
</li>

<li>
Install client-side dependencies using <pre><code>bower install</code></pre>
</li>

<li>
Install server-side dependencies using <pre><code>npm install</code></pre>
</li>

</ul>


##Running the application

To run the application simply type the following command <pre><code>grunt serve</code></pre>

##Testing 

<p>To run the client and server unit tests use

	 <pre><code>grunt test</code></pre></p>

<p>To only run server tests use <pre><code>grunt test:server</code></pre> </p>

<p>To only run client tests use <pre><code>grunt test:client</code></pre></p>



