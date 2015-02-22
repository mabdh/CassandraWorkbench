
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
Install client-side packages using <pre><code>bower install</code></pre>
</li>

<li>
Install server-side packages using <pre><code>npm install</code></pre>
</li>

</ul>


##Running the application

To run the application simply type the following command <pre><code>grunt serve</code></pre>

##Troubleshoot
Problem when running "bower install"
<ul class = "task-list"> 
<li>
Clear bower cache <pre><code>bower cache clean</code></pre>
</li>

<li>
If it doesn't work (Error, EACCESS) appear. Change .cache permission <pre><code>sudo chown -R username ~/.cache</code></pre>
</li>

<li>
Run bower install again <pre><code>bower install</code></pre>
</li>

</ul>
