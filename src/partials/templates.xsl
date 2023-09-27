<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="sidebar">
	<div>
		<legend>
			Playlists
			<span class="btn-toggle" toggle-text="Show">Hide</span>
		</legend>
		
		<div class="list-wrapper">
			<ul>
				<xsl:for-each select="./Playlists/*">
				<li class="active1">
					<span class="icon" style="background-image: url(~/icons/icon-folder.png);"></span>
					<span class="name"><xsl:value-of select="@name"/></span>
				</li>
				</xsl:for-each>
			</ul>
		</div>
	</div>
</xsl:template>

</xsl:stylesheet>